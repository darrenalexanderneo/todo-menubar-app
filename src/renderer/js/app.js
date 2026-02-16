console.log('app.js loading...');
console.log('Vue:', typeof Vue);
console.log('electronAPI:', typeof window.electronAPI);

const { createApp } = Vue;

createApp({
  data() {
    console.log('Vue app data() called');
    return {
      todos: [],
      newTodoText: '',
      newTodoPriority: 'low',
      searchQuery: '',
      filterPriority: '',
      filterCategory: '',
    };
  },

  computed: {
    filteredTodos() {
      let filtered = this.todos;

      // Apply search filter
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(todo =>
          todo.text.toLowerCase().includes(query)
        );
      }

      // Apply priority filter
      if (this.filterPriority) {
        filtered = filtered.filter(todo => todo.priority === this.filterPriority);
      }

      // Apply category filter
      if (this.filterCategory) {
        filtered = filtered.filter(todo =>
          todo.categories && todo.categories.includes(this.filterCategory)
        );
      }

      // Sort by createdAt (newest first)
      return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    categories() {
      const cats = new Set();
      this.todos.forEach(todo => {
        if (todo.categories) {
          todo.categories.forEach(cat => cats.add(cat));
        }
      });
      return Array.from(cats).sort();
    },

    hasCompleted() {
      return this.todos.some(todo => todo.completed);
    },

    stats() {
      const total = this.todos.length;
      const completed = this.todos.filter(t => t.completed).length;
      const pending = total - completed;
      return `${pending} pending, ${completed} completed`;
    },
  },

  methods: {
    async loadTodos() {
      try {
        const todos = await window.electronAPI.getTodos();
        this.todos = todos;
      } catch (error) {
        console.error('Failed to load todos:', error);
      }
    },

    async addNewTodo() {
      console.log('addNewTodo called! Text:', this.newTodoText);

      if (!this.newTodoText.trim()) {
        console.log('Empty text, returning');
        return;
      }

      try {
        console.log('Calling electronAPI.addTodo...');
        const todo = await window.electronAPI.addTodo({
          text: this.newTodoText.trim(),
          priority: this.newTodoPriority,
          source: 'manual',
        });

        console.log('Todo returned from IPC:', todo);

        // Add immediately to prevent delay
        // Check if it already exists to prevent duplicates
        if (!this.todos.find(t => t.id === todo.id)) {
          this.todos.unshift(todo); // Add to beginning for newest first
        }

        this.newTodoText = '';
        this.newTodoPriority = 'low'; // Reset to default

        // Focus back on input
        this.$nextTick(() => {
          if (this.$refs.addInput) {
            this.$refs.addInput.focus();
          }
        });
      } catch (error) {
        console.error('Failed to add todo:', error);
        alert('Error adding todo: ' + error.message);
      }
    },

    async toggleComplete(id) {
      const todo = this.todos.find(t => t.id === id);
      if (!todo) return;

      try {
        await window.electronAPI.updateTodo(id, { completed: !todo.completed });
        todo.completed = !todo.completed;
      } catch (error) {
        console.error('Failed to toggle todo:', error);
      }
    },

    async deleteTodo(id) {
      try {
        await window.electronAPI.deleteTodo(id);
        this.todos = this.todos.filter(t => t.id !== id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    },

    async clearCompleted() {
      const completedIds = this.todos.filter(t => t.completed).map(t => t.id);
      for (const id of completedIds) {
        await this.deleteTodo(id);
      }
    },

    async cyclePriority(todo) {
      // Cycle through: low -> medium -> high -> low
      const priorities = ['low', 'medium', 'high'];
      const currentIndex = priorities.indexOf(todo.priority);
      const nextIndex = (currentIndex + 1) % priorities.length;
      const newPriority = priorities[nextIndex];

      try {
        await window.electronAPI.updateTodo(todo.id, { priority: newPriority });
        todo.priority = newPriority;
      } catch (error) {
        console.error('Failed to update priority:', error);
      }
    },

    formatTime(timestamp) {
      const now = new Date();
      const date = new Date(timestamp);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString();
    },
  },

  mounted() {
    // Load initial todos
    this.loadTodos();

    // Listen for new todos added via hotkey
    window.electronAPI.onTodoAdded((todo) => {
      console.log('Event: todo-added received:', todo);
      // Only add if not already in the list (prevent duplicates)
      if (!this.todos.find(t => t.id === todo.id)) {
        this.todos.unshift(todo); // Add to beginning for newest first
        console.log('Added via event');
      } else {
        console.log('Todo already exists, skipping');
      }
    });

    // Listen for clipboard content from hotkey (prefill input for confirmation)
    window.electronAPI.onPrefillTodo((text) => {
      console.log('Event: prefill-todo received:', text);
      this.newTodoText = text;
      // Focus the input field
      this.$nextTick(() => {
        if (this.$refs.addInput) {
          this.$refs.addInput.focus();
          this.$refs.addInput.select(); // Select all text for easy editing
        }
      });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Delete key to remove selected/focused todo (future enhancement)
      // For now, focus on the add input with Cmd+N or /
      if ((e.metaKey && e.key === 'n') || e.key === '/') {
        e.preventDefault();
        if (this.$refs.addInput) {
          this.$refs.addInput.focus();
        }
      }

      // Escape to clear search
      if (e.key === 'Escape') {
        this.searchQuery = '';
        this.filterPriority = '';
        this.filterCategory = '';
      }
    });
  },
}).mount('#app');
