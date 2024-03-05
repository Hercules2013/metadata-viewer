import type Electron from 'electron';

type Windows = {
  main: Electron.BrowserWindow | null;
  tray: Electron.Tray | null;
};

const windows: Windows = {
  main: null,
  tray: null,
};

function setTitle(title: string) {
  windows.tray?.setTitle(title);
}

function dispatchToMain(channel: string, ...args: any[]) {
  windows.main?.webContents.send(channel, ...args);
}

export { windows, setTitle, dispatchToMain };
