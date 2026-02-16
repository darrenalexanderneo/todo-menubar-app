# Quick Start Guide

## Step-by-Step Setup (First Time)

### The Easy Way to Enable Permissions:

1. **Make sure the app is running** (it should be running now)

2. **Look at your menubar** (top-right of screen) - you should see a menubar icon

3. **Open the System Settings window** that just opened
   - Go to: Privacy & Security → Accessibility
   - You should see a list of apps

4. **Look for these possible names** (they all mean the same thing):
   - "Electron"
   - "Electron.app"
   - "node"
   - A path containing "Electron"

5. **If you DON'T see any of these:**
   - Copy this text: `Hello World` (just select and press Cmd+C)
   - Press **Cmd+Ctrl+K** (your new hotkey)
   - A dialog should pop up asking for permission
   - Click "Open Settings"
   - Now look again for "Electron" in the list

6. **Enable it:**
   - Check the checkbox next to "Electron" (or whatever name you found)
   - You may need to click the lock icon and enter your password first
   - Make sure it's CHECKED (✓)

7. **Restart the app:**
   ```bash
   pkill -f Electron
   cd ~/todo-menubar-app && npm start
   ```

8. **Test it:**
   - Copy some text: `Test todo item`
   - Press **Cmd+Ctrl+K**
   - You should see a notification: "Todo Added"
   - Click the menubar icon to see your todo!

## Alternative: Add the Electron App Directly

If you still can't find "Electron" in the list:

1. In Accessibility settings, click the lock icon (enter password)
2. Click the "+" button at the bottom
3. Press **Cmd+Shift+G** to open "Go to folder"
4. Paste this path:
   ```
   /Users/darrenneo/todo-menubar-app/node_modules/electron/dist/
   ```
5. Select **Electron.app**
6. Click "Open"
7. Make sure it's enabled (checked)
8. Restart the app

## Verification Commands

Check if permissions are working:
```bash
# Check if app is running
ps aux | grep -i electron | grep todo-menubar | wc -l

# Should show a number > 0 if running
```

Check the logs:
```bash
tail -20 /tmp/todo-app.log
```

Look for:
- ✅ "✓ Accessibility permissions granted" = SUCCESS!
- ✅ "✓ Global hotkey registered: Command+Control+K" = SUCCESS!
- ❌ "⚠ Accessibility permissions not granted" = Still need to enable

## Quick Test

Once enabled, try this:
1. Copy text: `My first todo from Slack`
2. Press: **Cmd+Ctrl+K**
3. See notification: "Todo Added"
4. Click menubar icon
5. See your todo with "Slack" category!

## Still Stuck?

Run this to see detailed logs:
```bash
cd ~/todo-menubar-app
npm start
# Watch for error messages
```

The app will tell you exactly what's wrong!
