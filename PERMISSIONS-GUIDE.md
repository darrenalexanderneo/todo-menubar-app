# Accessibility Permissions Setup Guide

## Problem
When prompted to enable accessibility permissions, you might not see "Todo Capture" in the list.

## Solution

### Method 1: Look for "Electron" or "node"
1. Open **System Settings** (or System Preferences on older macOS)
2. Go to **Privacy & Security** → **Accessibility**
3. Look for one of these names:
   - "Electron"
   - "Electron Helper"
   - "node"
   - The full path to the app
4. **Enable the checkbox** next to it
5. **Restart the Todo app**

### Method 2: Trigger the Permission Dialog
1. Make sure the Todo app is running (`npm start`)
2. Copy some text (any text)
3. Press `Cmd+Shift+T`
4. A dialog will pop up asking for permission
5. Click **"Open System Settings"**
6. The System Settings will open directly to Accessibility
7. **Look for "Electron"** in the list (it might be at the bottom)
8. **Enable it** by checking the checkbox
9. You may need to authenticate with your Mac password
10. **Close and restart the Todo app**

### Method 3: Add Manually
1. Open **System Settings** → **Privacy & Security** → **Accessibility**
2. Click the **lock icon** at the bottom to make changes (enter your password)
3. Click the **"+"** button to add an application
4. Navigate to: `/Users/darrenneo/todo-menubar-app/node_modules/electron/dist/Electron.app`
5. Select it and click **"Open"**
6. **Enable the checkbox**
7. **Restart the Todo app**

### Verification
After enabling permissions:
1. Restart the Todo app: `pkill -f Electron && npm start`
2. Copy some text
3. Press `Cmd+Shift+T`
4. You should see a notification: "Todo Added"
5. Click the menubar icon to see your todo

## Still Having Issues?

Check the console output:
```bash
cd ~/todo-menubar-app
npm start
```

Look for:
- ✅ "✓ Accessibility permissions granted" (Success!)
- ❌ "⚠ Accessibility permissions not granted" (Still need to enable)
- ✅ "✓ Global hotkey registered: CommandOrControl+Shift+T" (Working!)

## Why This Happens
During development with `npm start`, the app runs through Electron directly, so macOS shows "Electron" instead of "Todo Capture". When you build the final DMG (with `npm run build`), it will show up with the correct name.
