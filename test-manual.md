# Manual Testing Guide

## Prerequisites
1. App should be running (`npm start`)
2. Grant accessibility permissions when prompted (System Preferences > Security & Privacy > Privacy > Accessibility)

## Test Cases

### 1. Basic App Launch ✓
- [x] Menubar icon appears in macOS menubar (top-right)
- [x] Click icon → dropdown window appears
- [x] Window size is ~360x500px
- [x] Click outside window → window closes

### 2. Manual Todo Addition
- [ ] Type text in "Add a new todo..." input field
- [ ] Press Enter or click "+" button
- [ ] Todo appears in the list below
- [ ] Input field clears after adding
- [ ] Todo has timestamp (e.g., "just now")

### 3. Todo List Operations
- [ ] Click checkbox → todo marked complete (strikethrough)
- [ ] Click checkbox again → todo uncompleted
- [ ] Click "×" button → todo deleted
- [ ] Add multiple todos → sorted by newest first

### 4. Search and Filters
- [ ] Type in search box → todos filter by text match
- [ ] Select priority filter → shows only matching priority
- [ ] Select category filter → shows only matching category
- [ ] Clear search → all todos shown again

### 5. Auto-Detection Features
- [ ] Add todo with text "URGENT" → priority badge shows "high"
- [ ] Add todo with text "Slack message" → category tag shows "Slack"
- [ ] Add todo with text "Telegram chat" → category tag shows "Telegram"

### 6. Global Hotkey (Core Feature)
- [ ] Open any app (Slack, TextEdit, Browser)
- [ ] Copy some text (Cmd+C)
- [ ] Press Cmd+Shift+T
- [ ] Permission dialog appears (first time only)
- [ ] Grant permission in System Preferences
- [ ] Press Cmd+Shift+T again
- [ ] Menubar window flashes briefly
- [ ] Todo appears in list with copied text
- [ ] System notification shows "Todo Added"

### 7. Edge Cases
- [ ] Press hotkey with empty clipboard → notification shows "Empty Clipboard"
- [ ] Copy very long text (>1000 chars) → todo created, text truncated with "..."
- [ ] Add empty todo manually → button disabled, cannot submit
- [ ] Quit app → todos persist
- [ ] Restart app → todos still visible

### 8. Data Persistence
- [ ] Check file exists: `~/Library/Application Support/todo-menubar-app/todos.json`
- [ ] Add a todo
- [ ] Quit app completely
- [ ] Restart app
- [ ] Todo still present

### 9. Keyboard Shortcuts
- [ ] Press `/` or Cmd+N → focus on add todo input
- [ ] Press Escape → clears search and filters

### 10. Clear Completed
- [ ] Mark several todos as completed
- [ ] Click "Clear Completed" button in footer
- [ ] All completed todos removed

## Expected Behaviors

### Todo Structure
Each todo should have:
- Text content
- Checkbox (completed state)
- Priority badge (if detected or set)
- Category tags (if detected)
- Timestamp (relative time like "5m ago")
- Delete button (×)

### Footer Stats
Should show: "X pending, Y completed"

### Empty State
When no todos exist: "No todos yet! Copy text anywhere and press Cmd+Shift+T to add your first todo."

## Known Limitations
1. Menubar icon is default Electron icon (custom icon not yet created)
2. Cannot edit todo text after creation (future enhancement)
3. No todo priorities can be set manually (auto-detected only)
4. No recurring todos
5. No notifications for overdue todos
