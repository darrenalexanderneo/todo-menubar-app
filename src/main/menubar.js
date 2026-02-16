import { menubar } from 'menubar';
import { app, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createMenubar() {
  const indexPath = path.join(__dirname, '../renderer/index.html');
  const indexUrl = pathToFileURL(indexPath).href;

  console.log('Loading index from:', indexUrl);

  const mb = menubar({
    index: indexUrl,
    icon: path.join(__dirname, '../renderer/assets/iconTemplate.png'),
    browserWindow: {
      width: 360,
      height: 500,
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
      resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
    },
    preloadWindow: true,
    showDockIcon: false,
  });

  mb.on('ready', () => {
    console.log('Menubar app is ready');

    // Create right-click context menu
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Todo Capture',
        click: () => {
          mb.showWindow();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit Todo Capture',
        click: () => {
          app.quit();
        }
      }
    ]);

    // Set the context menu on the tray
    mb.tray.setContextMenu(contextMenu);
    console.log('✓ Context menu added (right-click to quit)');
  });

  mb.on('after-create-window', () => {
    // Open DevTools in development mode
    if (process.env.NODE_ENV === 'development') {
      mb.window.webContents.openDevTools({ mode: 'detach' });
    }
  });

  mb.on('show', () => {
    console.log('Menubar window shown');
  });

  mb.on('hide', () => {
    console.log('Menubar window hidden');
  });

  return mb;
}
