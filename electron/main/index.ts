import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  OpenDialogOptions,
  Menu,
  MenuItemConstructorOptions,
} from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { update } from './window/update';
import { dispatchToMain } from './window/windows';

import { spawn } from 'child_process';

import log from 'electron-log/main';

log.initialize({
  preload: true,
});

import path from 'node:path';
import fs from 'fs-extra';

const isDev = !app.isPackaged;
const isWindows = process.platform === 'win32';

const rootPath = isDev ? process.cwd() : path.resolve(process.resourcesPath);

const exiftoolPath = isWindows
  ? path.join(rootPath, 'exiftool.exe', 'exiftool.exe')
  : path.join(rootPath, 'exiftool.pl', 'exiftool');

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST;

// // Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

import { windows } from './window/windows';
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  windows.main = new BrowserWindow({
    title: 'Metadata Viewer',
    icon: join(process.env.VITE_PUBLIC, 'icon.ico'),
    width: 1080,
    height: 680,
    frame: true,
    trafficLightPosition: {
      x: 10,
      y: 8,
    },
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
    },
  });

  if (url) {
    windows.main.loadURL(url);
  } else {
    windows.main.loadFile(indexHtml);
  }

  // if crashed, log it
  windows.main.webContents.on('render-process-gone', (event, details) => {
    log.error('render-process-gone', details);
  });

  // Make all links open with the browser, not with the application
  windows.main.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  // Clear Logs
  fs.unlinkSync(log.transports.file.getFile().path);

  // Enable customized menu
  installMenu();

  // Apply electron-updater

  update(windows.main);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  windows.main = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (windows.main) {
    // Focus on the main window if the user tried to open another
    if (windows.main.isMinimized()) windows.main.restore();
    windows.main.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

function installMenu() {
  const isMac = process.platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Email Support',
          click: async () => {
            await shell.openExternal('mailto:hello@metadatafixer.com');
          },
        },
      ],
    },
  ];

  // Build the menu from the template
  const menu = Menu.buildFromTemplate(template);

  // Set as application menu (for all windows)
  Menu.setApplicationMenu(menu);
}

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.handle('scan-folder', async (evt, args) => {
  const options: OpenDialogOptions = {
    title: 'Select the folder to scan',
    buttonLabel: 'Select',
    properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
  };

  dialog.showOpenDialog(options).then(async (dir: { canceled: boolean; filePaths?: string[] }) => {
    log.info('Chose directory', JSON.stringify(dir));
    if (!dir || dir.canceled || !dir.filePaths) return;

    let files:string[] = [];

    try {
      files = fs.readdirSync(dir.filePaths[0]);
    } catch (e: any) {
      console.error(e);
      log.error('Failed to open dialog ', e.toString());
    }

    dispatchToMain('read-folder', {
      folder: dir.filePaths[0],
      files: files
    });
  });
});

ipcMain.handle('scan-file', async (evt, args) => {
  const { path } = args;

  let output = "";

  await new Promise<void>((resolve) => {
    const exifCommand = spawn(
      exiftoolPath,
      [
        path,
      ].filter((e) => e) as string[]
    );

    exifCommand.stdout.on('data', (data) => {
      output += data.toString();
    });

    exifCommand.stderr.on('data', (data: any) => {
      log.info(`Exiftool stderr: ${data.toString()}`);
    });

    exifCommand.on('exit', (code: any) => {
      log.info(`Exiftool description child process exited with code ${code.toString()}`);
      resolve();
    });
  });

  // Format data
  const formattedData = output.trim().split('\n').map((meta, index) => {
    const chunks = meta.split(':');
    return {
      index: index,
      type: chunks[0].trim(),
      value: chunks.slice(1).join(':').trim(),
    };
  });

  dispatchToMain('read-file', formattedData);
});

ipcMain.handle('save-file', async (evt, args) => {
  const { command } = args;

  log.info(exiftoolPath, command);

  await new Promise<void>((resolve) => {
    const exifCommand = spawn(
      exiftoolPath,
      [
        command,
      ].filter((e) => e) as string[]
    );

    exifCommand.stderr.on('data', (data: any) => {
      log.info(`Exiftool stderr: ${data.toString()}`);
      return "error";
    });

    exifCommand.on('exit', (code: any) => {
      log.info(`Exiftool description child process exited with code ${code.toString()}`);
      resolve();
    });
  });

  return "success";
})
