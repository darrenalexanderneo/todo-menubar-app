const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loading...');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Todo CRUD operations
  getTodos: () => ipcRenderer.invoke('get-todos'),
  addTodo: (todo) => ipcRenderer.invoke('add-todo', todo),
  updateTodo: (id, updates) => ipcRenderer.invoke('update-todo', id, updates),
  deleteTodo: (id) => ipcRenderer.invoke('delete-todo', id),

  // Listen for todo updates from main process
  onTodoAdded: (callback) => {
    ipcRenderer.on('todo-added', (event, todo) => callback(todo));
  },

  // Listen for clipboard content to prefill input
  onPrefillTodo: (callback) => {
    ipcRenderer.on('prefill-todo', (event, text) => callback(text));
  },

  // Clipboard operations
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
});

console.log('✓ electronAPI exposed to renderer');
