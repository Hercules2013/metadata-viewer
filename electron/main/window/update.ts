import { app, Tray, Menu, crashReporter } from 'electron';
import { autoUpdater } from 'electron-updater';
import logger from 'electron-log/main';
import path from 'path';
import type Electron from 'electron';
import { windows } from './windows';
const rootPath = !app.isPackaged ? process.cwd() : process.resourcesPath;

const iconPath = path.join(rootPath, 'app-files', 'iconTemplate.png');

logger.info('iconPath', iconPath);

const isBetaBuild = app.getVersion().includes('beta');

export function update(win: Electron.BrowserWindow) {
  autoUpdater.autoDownload = true;
  autoUpdater.logger = logger;
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
  windows.tray = new Tray(iconPath);
  windows.tray.getIgnoreDoubleClickEvents();
  windows.tray.setToolTip('Metadata Fixer');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        win.show();
        win.focus();
      },
    },
    {
      label: 'Check for updates',
      click: () => {
        autoUpdater.checkForUpdates();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
    ...(isBetaBuild
      ? [
          {
            label: 'Open DevTools',
            click: () => {
              win.webContents.openDevTools();
            },
          },
        ]
      : []),
  ]);
  windows.tray.setContextMenu(contextMenu);

  crashReporter.start({
    productName: 'Metadata Fixer',
    submitURL: '',
    uploadToServer: false,
  });
}
