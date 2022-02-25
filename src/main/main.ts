/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Menu, nativeTheme } from 'electron';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import auth from './net/auth';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
const store = new Store({ encryptionKey: 'yadds0bfs' });

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('dark-mode:light', async () => {
  nativeTheme.themeSource = 'light';
});
ipcMain.handle('dark-mode:dark', async () => {
  nativeTheme.themeSource = 'dark';
});
ipcMain.handle('dark-mode:system', async () => {
  nativeTheme.themeSource = 'system';
});

ipcMain.on('get-electron-store', async (event, val) => {
  event.returnValue = store.get(val);
});

ipcMain.on('set-electron-store', async (_, key, val) => {
  store.set(key, val);
});

ipcMain.on('get-os-platform', async (event) => {
  event.returnValue = process.platform;
});

ipcMain.on('get-app-version', async (event) => {
  event.returnValue = app.getVersion();
});

ipcMain.on('popup-context-menu', async (_, props) => {
  Menu.buildFromTemplate(props).popup();
});

ipcMain.on('open-via-broswer', async (_, url) => {
  shell.openExternal(url);
});

ipcMain.on('axios-auth', async (event, quickConnectID: string, account: string, passwd: string) => {
  const respData = await auth(quickConnectID, account, passwd);
  event.sender.send('axios-auth-reply', respData);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    x: (store.get('windowBounds.x') as number) || undefined,
    y: (store.get('windowBounds.y') as number) || undefined,
    width: (store.get('windowBounds.width') as number) || 1024,
    height: (store.get('windowBounds.height') as number) || 768,
    minWidth: 1024,
    minHeight: 768,
    titleBarStyle: 'hiddenInset',
    [(process.platform === 'darwin' && 'vibrancy') as string]: 'sidebar',
    [(process.platform === 'win32' && 'backgroundColor') as string]: '#dcdee0',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.menuBarVisible = false;

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('resized', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('windowBounds', bounds);
    }
  });

  mainWindow.on('moved', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('windowBounds', bounds);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

nativeTheme.themeSource = (store.get('yaddsAppearance') as 'system' | 'light' | 'dark') ?? 'system';
app.commandLine.appendSwitch('force_high_performance_gpu');

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
