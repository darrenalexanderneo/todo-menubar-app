#!/bin/bash
# Stop the Todo Menubar App

echo "Stopping Todo Menubar App..."
killall -9 Electron 2>/dev/null
killall -9 "Electron Helper" 2>/dev/null
sleep 1

# Check if any instances are still running
REMAINING=$(ps aux | grep -i electron | grep todo-menubar | grep -v grep | wc -l | tr -d ' ')

if [ "$REMAINING" -eq 0 ]; then
    echo "✓ All instances stopped successfully!"
else
    echo "⚠ Warning: $REMAINING process(es) still running"
    echo "Try running: sudo killall -9 Electron"
fi
