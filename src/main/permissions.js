import { systemPreferences, dialog } from 'electron';

/**
 * Check if the app has accessibility permissions
 * Required for global shortcuts on macOS 10.14+
 */
export function checkAccessibilityPermissions() {
  // Only check on macOS
  if (process.platform !== 'darwin') {
    return true;
  }

  // Check if we already have permission (don't prompt)
  const hasPermission = systemPreferences.isTrustedAccessibilityClient(false);

  if (hasPermission) {
    console.log('✓ Accessibility permissions granted');
    return true;
  }

  console.log('⚠ Accessibility permissions not granted');
  return false;
}

/**
 * Request accessibility permissions with user-friendly explanation
 */
export function requestAccessibilityPermissions() {
  if (process.platform !== 'darwin') {
    return true;
  }

  // Check current status
  const hasPermission = systemPreferences.isTrustedAccessibilityClient(false);

  if (hasPermission) {
    return true;
  }

  // Show explanation dialog
  const choice = dialog.showMessageBoxSync({
    type: 'info',
    title: 'Accessibility Permission Required',
    message: 'Todo Capture needs accessibility permissions',
    detail: 'This app uses a global hotkey (Cmd+Shift+T) to capture todos from anywhere on your Mac.\n\n' +
            'macOS requires accessibility permissions for this feature.\n\n' +
            'Click "Open Settings" to grant permission, then restart the app.',
    buttons: ['Open Settings', 'Not Now'],
    defaultId: 0,
    cancelId: 1,
  });

  if (choice === 0) {
    // Prompt to open System Preferences
    // This will open System Preferences and show a permission prompt
    systemPreferences.isTrustedAccessibilityClient(true);
    return false; // Permission not yet granted, user needs to enable it manually
  }

  return false;
}

/**
 * Show a notification that permissions are required
 */
export function showPermissionRequiredNotice() {
  dialog.showMessageBoxSync({
    type: 'warning',
    title: 'Global Hotkey Disabled',
    message: 'Accessibility permissions not granted',
    detail: 'The global hotkey (Cmd+Shift+T) will not work without accessibility permissions.\n\n' +
            'You can still manually add todos by clicking the menubar icon.\n\n' +
            'To enable the hotkey, grant accessibility permissions in:\n' +
            'System Preferences > Security & Privacy > Privacy > Accessibility',
    buttons: ['OK'],
  });
}
