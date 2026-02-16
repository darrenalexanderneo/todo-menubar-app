import Store from 'electron-store';
import { randomBytes } from 'crypto';

// Initialize electron-store with schema
const store = new Store({
  name: 'todos',
  defaults: {
    todos: [],
  },
  schema: {
    todos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          completed: { type: 'boolean' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', ''] },
          categories: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string' },
          source: { type: 'string' },
        },
        required: ['id', 'text', 'completed', 'createdAt'],
      },
    },
  },
});

// Keep reference to main window for sending updates
let mainWindow = null;

export function setMainWindow(win) {
  mainWindow = win;
}

// Generate unique ID
function generateId() {
  return randomBytes(16).toString('hex');
}

// Auto-detect categories from text
function detectCategories(text) {
  const categories = [];
  const lowerText = text.toLowerCase();

  if (lowerText.includes('slack')) categories.push('Slack');
  if (lowerText.includes('telegram')) categories.push('Telegram');
  if (lowerText.includes('email')) categories.push('Email');
  if (lowerText.includes('meeting')) categories.push('Meeting');

  return categories;
}

// Auto-detect priority from text
function detectPriority(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('!')) {
    return 'high';
  }
  if (lowerText.includes('important')) {
    return 'medium';
  }

  return 'low';
}

// Get all todos
export function getTodos() {
  return store.get('todos', []);
}

// Add a new todo
export function addTodo(text, options = {}) {
  const todos = getTodos();

  const todo = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    priority: options.priority || detectPriority(text),
    categories: options.categories || detectCategories(text),
    createdAt: new Date().toISOString(),
    source: options.source || 'manual',
  };

  todos.push(todo);
  store.set('todos', todos);

  // Notify renderer if window is available
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send('todo-added', todo);
  }

  console.log('Todo added:', todo);
  return todo;
}

// Update a todo
export function updateTodo(id, updates) {
  const todos = getTodos();
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    throw new Error(`Todo with id ${id} not found`);
  }

  todos[index] = { ...todos[index], ...updates };
  store.set('todos', todos);

  console.log('Todo updated:', todos[index]);
  return todos[index];
}

// Delete a todo
export function deleteTodo(id) {
  const todos = getTodos();
  const filtered = todos.filter(t => t.id !== id);

  if (filtered.length === todos.length) {
    throw new Error(`Todo with id ${id} not found`);
  }

  store.set('todos', filtered);

  console.log('Todo deleted:', id);
  return { success: true };
}

// Clear all completed todos
export function clearCompleted() {
  const todos = getTodos();
  const filtered = todos.filter(t => !t.completed);
  store.set('todos', filtered);

  console.log('Completed todos cleared');
  return { success: true };
}

// Get store file path (for debugging)
export function getStorePath() {
  return store.path;
}
