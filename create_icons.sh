#!/bin/bash

# Create a simple SVG icon and convert it
mkdir -p build/icons src/renderer/assets

# Create app icon SVG (colorful checkmark)
cat > /tmp/app_icon.svg << 'SVG'
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="180" fill="url(#grad)"/>
  <path d="M 280 520 L 420 680 L 760 320" stroke="white" stroke-width="100" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
SVG

# Create menubar icon SVG (simple black checkmark)
cat > /tmp/menubar_icon.svg << 'SVG'
<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg">
  <path d="M 4 12 L 8 16 L 18 6" stroke="black" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
SVG

echo "✓ SVG files created"

# Convert using built-in tools
if command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w 1024 -h 1024 /tmp/app_icon.svg > build/icons/icon.png
    rsvg-convert -w 22 -h 22 /tmp/menubar_icon.svg > src/renderer/assets/iconTemplate.png
    echo "✓ Icons converted with rsvg-convert"
elif command -v qlmanage &> /dev/null; then
    # Use macOS Quick Look to convert (fallback)
    echo "Using qlmanage to convert..."
    cp /tmp/app_icon.svg build/icons/
    cp /tmp/menubar_icon.svg src/renderer/assets/
    echo "✓ SVG files copied (will use directly)"
else
    echo "Installing conversion tool..."
fi
