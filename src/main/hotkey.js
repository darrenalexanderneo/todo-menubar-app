import { globalShortcut, clipboard, dialog, Notification } from 'electron';
import * as store from './store.js';

const HOTKEY = 'Command+Control+K';
let menubarInstance = null;

/**
 * Register the global hotkey for clipboard capture
 * @param {object} mb - Menubar instance
 */
export function registerGlobalHotkey(mb) {
  menubarInstance = mb;

  try {
    // Unregister if already registered
    if (globalShortcut.isRegistered(HOTKEY)) {
      console.log(`Hotkey ${HOTKEY} already registered, unregistering first...`);
      globalShortcut.unregister(HOTKEY);
    }

    // Register the hotkey
    const success = globalShortcut.register(HOTKEY, handleHotkeyPress);

    if (success) {
      console.log(`✓ Global hotkey registered: ${HOTKEY}`);
      showNotification('Todo Capture Ready', `Press ${HOTKEY.replace('CommandOrControl', 'Cmd')} to capture todos`);
    } else {
      console.error(`✗ Failed to register hotkey: ${HOTKEY}`);
      showError('Hotkey Registration Failed', `Could not register ${HOTKEY}. It may be in use by another app.`);
    }

    return success;
  } catch (error) {
    console.error('Error registering hotkey:', error);
    showError('Hotkey Error', error.message);
    return false;
  }
}

/**
 * Unregister the global hotkey
 */
export function unregisterGlobalHotkey() {
  try {
    if (globalShortcut.isRegistered(HOTKEY)) {
      globalShortcut.unregister(HOTKEY);
      console.log(`✓ Hotkey ${HOTKEY} unregistered`);
    }
  } catch (error) {
    console.error('Error unregistering hotkey:', error);
  }
}

/**
 * Handle hotkey press - capture clipboard and create todo
 */
function handleHotkeyPress() {
  console.log(`🔥 HOTKEY PRESSED: ${HOTKEY}`);
  console.log(`   Time: ${new Date().toLocaleTimeString()}`);

  try {
    // Read clipboard
    const clipboardText = clipboard.readText();
    console.log(`   Clipboard content: "${clipboardText}"`);

    // Validate clipboard content
    if (!clipboardText || clipboardText.trim().length === 0) {
      console.log('Clipboard is empty, ignoring hotkey press');
      showNotification('Empty Clipboard', 'Copy some text first, then press the hotkey');
      return;
    }

    // Limit text length (prevent huge clipboard content)
    let text = clipboardText.trim();
    const maxLength = 1000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '...';
      console.log(`Clipboard text truncated to ${maxLength} characters`);
    }

    // Instead of auto-creating, show window with pre-filled input for user to confirm
    if (menubarInstance && menubarInstance.window) {
      // Show the window
      menubarInstance.showWindow();

      // Send clipboard content to renderer to pre-fill the input
      menubarInstance.window.webContents.send('prefill-todo', text);

      console.log('Showing window with clipboard content for confirmation');
    }

  } catch (error) {
    console.error('Error handling hotkey press:', error);
    showError('Failed to Create Todo', error.message);
  }
}

/**
 * Get a preview of the todo text (first line or first 50 chars)
 */
function getTodoPreview(text) {
  const firstLine = text.split('\n')[0];
  if (firstLine.length <= 50) {
    return firstLine;
  }
  return firstLine.substring(0, 47) + '...';
}

/**
 * Show the menubar window to display the newly added todo
 */
function flashMenubarWindow() {
  if (!menubarInstance || !menubarInstance.window) return;

  // Show window and keep it open so user can see their todos
  menubarInstance.showWindow();

  // No longer auto-hiding - let the user close it themselves
  // They can click outside the window or press Esc to close it
}

/**
 * Show a system notification
 */
function showNotification(title, body) {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title,
      body,
      silent: true, // Don't play sound
    });
    notification.show();
  } else {
    console.log('Notifications not supported:', title, body);
  }
}

/**
 * Show an error dialog
 */
function showError(title, message) {
  console.error(`Error: ${title} - ${message}`);

  // Only show dialog in development or for critical errors
  if (process.env.NODE_ENV === 'development') {
    dialog.showErrorBox(title, message);
  }
}

/**
 * Check if hotkey is registered
 */
export function isHotkeyRegistered() {
  return globalShortcut.isRegistered(HOTKEY);
}
