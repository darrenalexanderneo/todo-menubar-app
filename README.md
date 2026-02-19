# Todo Capture for macOS 📝

A beautiful macOS menubar app for instantly capturing todos with a global hotkey. Perfect for capturing tasks from Slack, email, browser, or anywhere on your Mac!

![Todo Capture Icon](build/icons/icon_256x256.png)

## ✨ Features

- **⚡ Global Hotkey Capture** - Copy text, press `Cmd+Ctrl+K`, confirm and create todo
- **🎯 Menubar Integration** - Always accessible from your menubar with custom checkmark icon
- **🏷️ Priority Management** - Set priorities (High/Medium/Low) when adding or click to change
- **🔍 Search & Filter** - Search by text, filter by priority or category
- **✅ Todo Management** - Complete, delete, clear completed
- **💾 Persistent Storage** - All todos saved locally, survives app restarts
- **🤖 Auto-Detection** - Automatically detects priorities and categories from text
- **⌨️ Keyboard Shortcuts** - Quick access with `/` or `Cmd+N`
- **🖱️ Right-Click Menu** - Easy quit from menubar

## 📥 Installation

### Option 1: Download Pre-Built App (Recommended)

> **Note:** This app is not signed with an Apple Developer certificate. macOS may warn that the app is "damaged" or block it from opening. Follow the steps below to bypass this.

1. **Download the latest DMG** from [Releases](../../releases)
2. **Open the DMG** and drag `Todo Capture.app` to Applications
3. **Remove the quarantine flag** — open Terminal and run:
   ```bash
   xattr -cr "/Applications/Todo Capture.app"
   ```
4. **Launch** the app from Applications or Spotlight
5. **Grant Accessibility Permissions** when prompted (required for global hotkey)
   - System Settings → Privacy & Security → Accessibility
   - Enable "Todo Capture"
6. **Start using!** Press `Cmd+Ctrl+K` after copying text

### Option 2: Build from Source

**Requirements:**
- Node.js 20+
- macOS 10.14+

**Steps:**

```bash
# Clone the repository
git clone https://github.com/darrenalexanderneo/todo-menubar-app.git
cd todo-menubar-app

# Install dependencies
npm install

# Run in development mode
npm start

# Or build the app
npm run build

# The built app will be in dist/mac-arm64/Todo Capture.app
```

## 🚀 Usage

### Quick Start

1. **Copy any text** from anywhere (Slack, email, browser)
2. **Press `Cmd+Ctrl+K`**
3. **Review and confirm** - Edit if needed, set priority
4. **Press Enter** to create the todo

### Manual Adding

1. Click the menubar icon
2. Type your todo in the input field
3. Select priority (Low/Medium/High)
4. Press Enter or click "+"

### Managing Todos

- **Complete**: Click the checkbox ☑️
- **Change Priority**: Click the priority badge to cycle (Low → Medium → High)
- **Delete**: Click the × button
- **Search**: Type in the search box
- **Filter**: Use priority or category filters
- **Clear Completed**: Click button in footer

### Keyboard Shortcuts

- `Cmd+Ctrl+K` - Capture clipboard as todo (global)
- `/` or `Cmd+N` - Focus on add todo input
- `Escape` - Clear search and filters
- `Cmd+Q` - Quit app

### Auto-Detection

The app automatically detects:

**Priorities:**
- Contains "URGENT", "ASAP", "!" → High priority
- Contains "important" → Medium priority
- Default → Low priority

**Categories:**
- Contains "Slack" → Slack category
- Contains "Telegram" → Telegram category
- Contains "email" → Email category
- Contains "meeting" → Meeting category

## 💾 Data Storage

All todos are stored locally at:
```
~/Library/Application Support/todo-menubar-app/todos.json
```

**Storage is efficient:**
- Each todo ≈ 200-500 bytes
- 1,000 todos ≈ 500 KB
- Deleted todos are removed (not kept)

**Backup your todos:**
```bash
cp ~/Library/Application\ Support/todo-menubar-app/todos.json ~/Desktop/todos-backup.json
```

## 🛠️ Development

### Project Structure

```
todo-menubar-app/
├── src/
│   ├── main/              # Electron main process
│   │   ├── index.js       # App entry & IPC handlers
│   │   ├── menubar.js     # Menubar setup
│   │   ├── hotkey.js      # Global hotkey registration
│   │   ├── store.js       # Data persistence
│   │   └── permissions.js # macOS permissions
│   ├── preload/
│   │   └── preload.js     # Secure IPC bridge
│   └── renderer/          # Vue 3 UI
│       ├── index.html
│       ├── js/app.js      # Vue app logic
│       └── styles/main.css
├── build/icons/           # App icons
└── package.json
```

### Tech Stack

- **Electron 33** - Cross-platform desktop framework
- **menubar** - Menubar app helper
- **electron-store** - Persistent storage
- **Vue 3** - Reactive UI framework

### Scripts

```bash
npm start       # Run in development mode (with DevTools)
npm run dev     # Same as start
npm run build   # Build DMG for distribution
```

## 🔒 Privacy & Security

- ✅ **All data stays local** - No cloud, no tracking, no analytics
- ✅ **No network access** - App works completely offline
- ✅ **Open source** - Review the code yourself
- ✅ **Clipboard access only on hotkey** - Not monitoring your clipboard
- ✅ **Secure IPC** - Context isolation enabled

### Why Accessibility Permission?

macOS requires accessibility permission for apps that register global keyboard shortcuts. The app only listens for `Cmd+Ctrl+K` - it doesn't monitor your keyboard otherwise.

## 🐛 Troubleshooting

### "App is Damaged and Can't Be Opened" / "App is Corrupted"

macOS Gatekeeper blocks apps that aren't signed with an Apple Developer certificate. This is expected for open-source apps distributed outside the App Store.

**Fix (one-time step):**

1. Move `Todo Capture.app` to `/Applications` if you haven't already
2. Open **Terminal** and run:
   ```bash
   xattr -cr "/Applications/Todo Capture.app"
   ```
3. Launch the app normally

**Alternative (System Settings):**

After attempting to open the app, go to **System Settings → Privacy & Security** and click **"Open Anyway"** next to the Todo Capture entry.

> This only needs to be done once. The app is open-source — you can review all the code in this repo.

---

### Hotkey Not Working

1. **Check Accessibility Permissions:**
   - System Settings → Privacy & Security → Accessibility
   - Ensure "Todo Capture" is enabled
   - Restart the app after granting permission

2. **Hotkey Conflict:**
   - Another app might be using `Cmd+Ctrl+K`
   - Check console for "Failed to register hotkey"

### App Not Appearing in Menubar

1. Check if app is running: Look for "Todo Capture" in Activity Monitor
2. Try restarting the app
3. Check Console app for error messages

### Todos Not Persisting

1. Check storage file exists: `ls ~/Library/Application\ Support/todo-menubar-app/todos.json`
2. Check file permissions
3. Look for errors in Console app

## 📝 Release Notes

### Version 1.0.0

**Initial Release**
- Global hotkey capture with clipboard confirmation
- Priority management with auto-detection
- Search and filtering
- Category auto-detection
- Persistent local storage
- Custom checkmark icon
- Right-click menu for easy quit

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use and modify as needed.

## 🙏 Credits

Built with:
- [Electron](https://www.electronjs.org/)
- [menubar](https://github.com/maxogden/menubar)
- [electron-store](https://github.com/sindresorhus/electron-store)
- [Vue 3](https://vuejs.org/)

---

**Made with ❤️ for productivity enthusiasts**

If you find this useful, consider starring the repo! ⭐
