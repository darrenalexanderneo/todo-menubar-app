import { app, ipcMain, globalShortcut } from 'electron';
import { createMenubar } from './menubar.js';
import * as store from './store.js';
import { checkAccessibilityPermissions, requestAccessibilityPermissions } from './permissions.js';
import { registerGlobalHotkey, unregisterGlobalHotkey } from './hotkey.js';

// Keep a global reference to prevent garbage collection
let mb;

app.whenReady().then(() => {
  console.log('App is ready, setting up IPC handlers first...');

  // Setup IPC handlers BEFORE creating menubar to avoid race condition
  setupIpcHandlers();
  console.log('IPC handlers registered');

  // Check accessibility permissions
  const hasPermissions = checkAccessibilityPermissions();

  // Create menubar
  mb = createMenubar();

  mb.on('ready', () => {
    console.log('Menubar ready');
    // Set the main window reference for store updates
    store.setMainWindow(mb.window);

    console.log('Store path:', store.getStorePath());

    // Register global hotkey if we have permissions
    if (hasPermissions) {
      registerGlobalHotkey(mb);
    } else {
      // Request permissions
      console.log('Requesting accessibility permissions...');
      const granted = requestAccessibilityPermissions();
      if (granted) {
        registerGlobalHotkey(mb);
      }
    }
  });
});

// Handle app activation (macOS specific)
app.on('activate', () => {
  // On macOS, re-create menubar if it doesn't exist
  if (!mb) {
    mb = createMenubar();
  }
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  // On macOS, apps typically stay active until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up global shortcuts when quitting
app.on('will-quit', () => {
  console.log('App quitting, cleaning up...');
  unregisterGlobalHotkey();
  globalShortcut.unregisterAll();
});

// Setup IPC handlers for communication with renderer
function setupIpcHandlers() {
  // Get all todos
  ipcMain.handle('get-todos', async () => {
    try {
      return store.getTodos();
    } catch (error) {
      console.error('Error getting todos:', error);
      return [];
    }
  });

  // Add a new todo
  ipcMain.handle('add-todo', async (event, todoData) => {
    try {
      return store.addTodo(todoData.text, {
        priority: todoData.priority,
        categories: todoData.categories,
        source: todoData.source || 'manual',
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  });

  // Update a todo
  ipcMain.handle('update-todo', async (event, id, updates) => {
    try {
      return store.updateTodo(id, updates);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  });

  // Delete a todo
  ipcMain.handle('delete-todo', async (event, id) => {
    try {
      return store.deleteTodo(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  });

  // Clear completed todos
  ipcMain.handle('clear-completed', async () => {
    try {
      return store.clearCompleted();
    } catch (error) {
      console.error('Error clearing completed todos:', error);
      throw error;
    }
  });
}

// Log unhandled errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});
