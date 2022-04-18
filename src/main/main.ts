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
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Menu,
  nativeTheme,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
} from 'electron';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
import auth from './net/auth';
import poll from './net/poll';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const isDarwin = process.platform === 'darwin';
const isWin32 = process.platform === 'win32';
const isLinux = process.platform === 'linux';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
const store = new Store({ encryptionKey: 'yadds0bfs' });

if (isDevelopment) {
  require('electron-debug')();
}

if (isProduction) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const getAssetPath = (...paths: string[]): string => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  if (isDevelopment) {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];
    await installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload
      )
      .catch(console.log);
  }

  mainWindow = new BrowserWindow({
    show: false,
    x: (store.get('windowBounds.x') as number) || undefined,
    y: (store.get('windowBounds.y') as number) || undefined,
    [((isDarwin || isLinux) && 'width') as string]: (store.get('windowBounds.width') as number) || 990,
    [(isWin32 && 'width') as string]: (store.get('windowBounds.width') as number) || 990 + 16,
    height: (store.get('windowBounds.height') as number) || 720,
    [((isDarwin || isLinux) && 'minWidth') as string]: 990,
    [(isWin32 && 'minWidth') as string]: 990 + 16, // The min-width will be smaller, workaround on Microsoft Buuuuuugdows platforms!!!
    minHeight: 720,
    [(isDarwin && 'titleBarStyle') as string]: 'hidden',
    // trafficLightPosition: { x: 19, y: 19 },
    [(isDarwin && 'vibrancy') as string]: 'sidebar',
    [((isWin32 || isLinux) && 'backgroundColor') as string]: '#e6e6e6',
    [(isDarwin && 'icon') as string]: getAssetPath('icon_darwin.png'),
    [(isWin32 && 'icon') as string]: getAssetPath('icon_win32.png'),
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
    } else if (store.get('isYaddsMaximized')) {
      mainWindow.maximize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('moved', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('windowBounds', bounds);
    }
  });

  mainWindow.on('resized', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      store.set('windowBounds', bounds);
    }
  });

  mainWindow.on('maximize', () => {
    if (mainWindow) {
      store.set('isYaddsMaximized', true);
    }
  });

  mainWindow.on('unmaximize', () => {
    if (mainWindow) {
      store.set('isYaddsMaximized', false);
    }
  });

  mainWindow.on('enter-full-screen', () => {
    if (mainWindow) {
      mainWindow.webContents.send('toogle-sidebar-mt', false);
      store.set('isYaddsFullScreen', true);
    }
  });

  mainWindow.on('leave-full-screen', () => {
    if (mainWindow) {
      mainWindow.webContents.send('toogle-sidebar-mt', true);
      store.set('isYaddsFullScreen', false);
    }
  });

  let willQuitApp = false;
  mainWindow.on('close', (event: Event) => {
    if (willQuitApp) {
      app.exit();
    } else if (store.get('isYaddsFullScreen')) {
      mainWindow?.setFullScreen(false);
      event.preventDefault();
    } else {
      event.preventDefault();
      mainWindow?.hide();
    }
  });
  app.on('before-quit', () => {
    willQuitApp = true;
  });

  if (isDevelopment) {
    mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => mainWindow?.webContents.inspectElement(x, y),
        },
      ]).popup({ window: mainWindow as BrowserWindow });
    });
  }

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

//------------------------------------------------------------------------------
// Initialize the default configuration of this application

nativeTheme.themeSource = (store.get('yaddsAppearance') as 'system' | 'light' | 'dark') ?? 'system';

app.applicationMenu = null;

app.commandLine.appendSwitch('force_high_performance_gpu');

//------------------------------------------------------------------------------
// When Electron has finished initializing, create the main window.

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });

  app
    .whenReady()
    .then(() => createWindow())
    .catch(console.log);
}

//------------------------------------------------------------------------------
// Add event listeners

nativeTheme.on('updated', () => {
  if (isWin32) {
    if (nativeTheme.shouldUseDarkColors) {
      mainWindow?.setBackgroundColor('#1f1f1f');
    } else {
      mainWindow?.setBackgroundColor('#e6e6e6');
    }
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow?.isVisible() === false) {
    mainWindow?.show();
  }
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (!isDarwin) {
    app.quit();
  }
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('set-application-menu', async (_, args) => {
  interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string;
    submenu?: DarwinMenuItemConstructorOptions[] | Menu;
  }

  const buildDarwinTemplate = (): MenuItemConstructorOptions[] => {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        { label: args.aboutYadds, selector: 'orderFrontStandardAboutPanel:' },
        { label: args.checkForUpdates },
        {
          label: args.preferences,
          accelerator: 'Command+,',
          click: () => mainWindow?.webContents.send('navigate', '/settings'),
        },
        { type: 'separator' },
        { label: args.services, submenu: [] },
        { type: 'separator' },
        { label: args.hideYadds, accelerator: 'Command+H', selector: 'hide:' },
        { label: args.hideOthers, accelerator: 'Command+Option+H', selector: 'hideOtherApplications:' },
        { type: 'separator' },
        { label: args.quitYadds, accelerator: 'Command+Q', click: () => app.exit() },
      ],
    };
    const subMenuFile: DarwinMenuItemConstructorOptions = {
      label: args.file,
      submenu: [{ label: args.newTask, accelerator: 'Command+N' }],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: args.edit,
      submenu: [
        { label: args.undo, accelerator: 'Command+Z', selector: 'undo:' },
        { label: args.redo, accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: args.cut, accelerator: 'Command+X', selector: 'cut:' },
        { label: args.copy, accelerator: 'Command+C', selector: 'copy:' },
        { label: args.paste, accelerator: 'Command+V', selector: 'paste:' },
        { label: args.selectAll, accelerator: 'Command+A', selector: 'selectAll:' },
      ],
    };
    const subMenuView: MenuItemConstructorOptions = {
      label: args.view,
      submenu: [
        { label: args.showHideSidebar, click: () => mainWindow?.webContents.send('toogle-sidebar') },
        {
          label: args.toggleFullScreen,
          accelerator: 'Ctrl+Command+F',
          click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()),
        },
      ],
    };
    const subMenuNavigation: MenuItemConstructorOptions = {
      label: args.navigate,
      submenu: [
        { label: args.all, click: () => mainWindow?.webContents.send('navigate', '/queueAll') },
        { label: args.downloading, click: () => mainWindow?.webContents.send('navigate', '/queueDownloading') },
        { label: args.completed, click: () => mainWindow?.webContents.send('navigate', '/queueFinished') },
        { label: args.active, click: () => mainWindow?.webContents.send('navigate', '/queueActive') },
        { label: args.inactive, click: () => mainWindow?.webContents.send('navigate', '/queueInactive') },
        { label: args.stopped, click: () => mainWindow?.webContents.send('navigate', '/queueStopped') },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: args.window,
      submenu: [
        { label: args.minimize, accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: args.zoom, selector: 'performZoom:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: args.help,
      submenu: [
        { label: args.openYaddsWebsite, click: () => shell.openExternal('https://github.com/shensven/Yadds') },
        { type: 'separator' },
        { label: args.openYaddsRepository, click: () => shell.openExternal('https://github.com/shensven/Yadds') },
        { label: args.reportABug, click: () => shell.openExternal('https://github.com/shensven/Yadds/issues') },
      ],
    };
    const subMenuDev: MenuItemConstructorOptions = {
      label: 'Dev',
      submenu: [
        { label: 'Reload', accelerator: 'Command+R', click: () => mainWindow?.webContents.reload() },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
      ],
    };

    return isDevelopment
      ? [subMenuAbout, subMenuFile, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp, subMenuDev]
      : [subMenuAbout, subMenuFile, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp];
  };

  if (isDarwin) {
    const template = buildDarwinTemplate();
    const applicationMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(applicationMenu);
  }
});

ipcMain.handle('set-context-menu', async (_, args) => {
  const template: MenuItemConstructorOptions[] = [
    { label: args.resumeAll },
    { label: args.pauseAll },
    { label: args.deleteAll },
    { type: 'separator' },
    { label: args.listView, type: 'radio', checked: true },
    { label: args.matrixView, type: 'radio', checked: false },
    { type: 'separator' },
    {
      label: args.sortBy,
      submenu: [
        {
          label: args.date,
          type: 'radio',
          checked: args.yaddsMainSortBy === 'date',
          click: () => mainWindow?.webContents.send('sortby', 'date'),
        },
        {
          label: args.downloadProgress,
          type: 'radio',
          checked: args.yaddsMainSortBy === 'download_progress',
          click: () => mainWindow?.webContents.send('sortby', 'download_progress'),
        },
        {
          label: args.downloadSpeed,
          type: 'radio',
          checked: args.yaddsMainSortBy === 'download_speed',
          click: () => mainWindow?.webContents.send('sortby', 'download_speed'),
        },
        {
          label: args.name,
          type: 'radio',
          checked: args.yaddsMainSortBy === 'name',
          click: () => mainWindow?.webContents.send('sortby', 'name'),
        },
        { type: 'separator' },
        {
          label: args.ascending,
          type: 'radio',
          checked: true,
        },
        {
          label: args.descending,
          type: 'radio',
          checked: false,
        },
      ],
    },
  ];
  Menu.buildFromTemplate(template).popup();
});

ipcMain.handle('set-tray', async (_, args) => {
  const { showMainWindow, quit } = args;

  const devMenu: MenuItemConstructorOptions[] = [
    { label: 'Reload', click: () => mainWindow?.webContents.reload() },
    { label: 'Toggle Developer Tools', click: () => mainWindow?.webContents.toggleDevTools() },
    { type: 'separator' },
  ];
  const normalMenu: MenuItemConstructorOptions[] = [
    {
      label: showMainWindow,
      click: () => {
        if (isDarwin) {
          mainWindow?.show();
        }
        if (isWin32 || isLinux) {
          if (store.get('isYaddsMaximized')) {
            mainWindow?.maximize();
          } else {
            mainWindow?.show();
          }
        }
      },
    },
    { type: 'separator' },
    { label: quit, click: () => app.exit() },
  ];

  const contextMenu = Menu.buildFromTemplate(
    isDevelopment && (isWin32 || isLinux) ? [...devMenu, ...normalMenu] : normalMenu
  );

  const getTrayIcon = () => {
    switch (process.platform) {
      case 'darwin':
        return isDevelopment
          ? nativeImage.createFromPath(getAssetPath('tray/darwin/trayDevTemplate.png'))
          : nativeImage.createFromPath(getAssetPath('tray/darwin/trayTemplate.png'));
      case 'win32':
        return isDevelopment
          ? nativeImage.createFromPath(getAssetPath('tray/win32/trayDev@2x.png')).resize({ width: 16, height: 16 })
          : nativeImage.createFromPath(getAssetPath('tray/win32/tray@2x.png')).resize({ width: 16, height: 16 });
      case 'linux':
        return isDevelopment
          ? nativeImage.createFromPath(getAssetPath('tray/linux/trayDev@2x.png')).resize({ width: 16, height: 16 })
          : nativeImage.createFromPath(getAssetPath('tray/linux/tray@2x.png')).resize({ width: 16, height: 16 });
      default:
        return isDevelopment
          ? nativeImage.createFromPath(getAssetPath('tray/linux/trayDev@2x.png')).resize({ width: 16, height: 16 })
          : nativeImage.createFromPath(getAssetPath('tray/linux/tray@2x.png')).resize({ width: 16, height: 16 });
    }
  };

  if (!tray) {
    // Init system's tary
    tray = new Tray(getTrayIcon());
    if (isWin32) {
      tray.setToolTip('Yadds');
    }
    tray.setContextMenu(contextMenu);
  } else {
    tray.setContextMenu(contextMenu);
  }

  tray.on('click', () => {
    if (isWin32) {
      if (store.get('isYaddsMaximized')) {
        mainWindow?.maximize();
      } else {
        mainWindow?.show();
      }
    }
  });
});

ipcMain.handle('dark-mode:light', async () => {
  nativeTheme.themeSource = 'light';
  if (isWin32) {
    mainWindow?.setBackgroundColor('#e6e6e6');
  }
});
ipcMain.handle('dark-mode:dark', async () => {
  nativeTheme.themeSource = 'dark';
  if (isWin32) {
    mainWindow?.setBackgroundColor('#1f1f1f');
  }
});
ipcMain.handle('dark-mode:system', async () => {
  nativeTheme.themeSource = 'system';
  if (isWin32) {
    if (nativeTheme.shouldUseDarkColors) {
      mainWindow?.setBackgroundColor('#1f1f1f'); // Dark background
    } else {
      mainWindow?.setBackgroundColor('#e6e6e6'); // Light background
    }
  }
});

ipcMain.handle('zoom-window', async () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('electron-store:get', async (event, val) => {
  event.returnValue = store.get(val);
});

ipcMain.on('electron-store:set', async (_, key, val) => {
  store.set(key, val);
});

ipcMain.on('get-os-platform', async (event) => {
  event.returnValue = process.platform;
});

ipcMain.on('get-app-version', async (event) => {
  event.returnValue = app.getVersion();
});

ipcMain.handle('open-via-broswer', async (_, url) => {
  shell.openExternal(url);
});

ipcMain.handle('net-auth', async (_, args) => {
  return auth(args);
});

ipcMain.handle('net-poll', async (_, args) => {
  return poll(args);
});
