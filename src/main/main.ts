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

let mainWindow: BrowserWindow | null = null;
let applicationMenu: Menu | null = null;
let tray: Tray | null = null;
const store = new Store({ encryptionKey: 'yadds0bfs' });

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

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

  nativeTheme.themeSource = (store.get('yaddsAppearance') as 'system' | 'light' | 'dark') ?? 'system';

  mainWindow = new BrowserWindow({
    show: false,
    x: (store.get('windowBounds.x') as number) || undefined,
    y: (store.get('windowBounds.y') as number) || undefined,
    width: (store.get('windowBounds.width') as number) || 960,
    height: (store.get('windowBounds.height') as number) || 720,
    minWidth: 960,
    minHeight: 720,
    [(isDarwin && 'titleBarStyle') as string]: 'hidden',
    // trafficLightPosition: { x: 19, y: 19 },
    [(isDarwin && 'vibrancy') as string]: 'sidebar',
    [(isWin32 && 'backgroundColor') as string]: '#e6e6e6',
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

  let willQuitApp = false;
  mainWindow.on('close', (event: Event) => {
    if (willQuitApp) {
      app.exit();
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

app.commandLine.appendSwitch('force_high_performance_gpu');

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
    .then(() => {
      createWindow();
    })
    .catch(console.log);
}

/**
 * Add event listeners...
 */

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

ipcMain.handle('set-application-menu', async (_, args) => {
  const menuItemLabel = {
    aboutYadds: args.aboutYadds,
    checkForUpdates: args.checkForUpdates,
    preferences: args.preferences,
    services: args.services,
    hideYadds: args.hideYadds,
    hideOthers: args.hideOthers,
    quitYadds: args.quitYadds,
    edit: args.edit,
    undo: args.undo,
    redo: args.redo,
    cut: args.cut,
    copy: args.copy,
    paste: args.paste,
    selectAll: args.selectAll,
    view: args.view,
    showHideSidebar: args.showHideSidebar,
    toggleFullScreen: args.toggleFullScreen,
    navigate: args.navigate,
    all: args.all,
    downloading: args.downloading,
    completed: args.completed,
    active: args.active,
    inactive: args.inactive,
    stopped: args.stopped,
    window: args.window,
    minimize: args.minimize,
    zoom: args.zoom,
    help: args.help,
    openYaddsWebsite: args.openYaddsWebsite,
    openYaddsRepository: args.openYaddsRepository,
    reportABug: args.reportABug,
  };

  interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string;
    submenu?: DarwinMenuItemConstructorOptions[] | Menu;
  }

  const buildDarwinTemplate = (): MenuItemConstructorOptions[] => {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: menuItemLabel.aboutYadds,
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          label: menuItemLabel.checkForUpdates,
        },
        {
          label: menuItemLabel.preferences,
          accelerator: 'Command+,',
          click: () => mainWindow?.webContents.send('navigate', '/settings'),
        },
        {
          type: 'separator',
        },
        {
          label: menuItemLabel.services,
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: menuItemLabel.hideYadds,
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: menuItemLabel.hideOthers,
          accelerator: 'Command+Option+H',
          selector: 'hideOtherApplications:',
        },
        {
          type: 'separator',
        },
        {
          label: menuItemLabel.quitYadds,
          accelerator: 'Command+Q',
          click: () => app.exit(),
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: menuItemLabel.edit,
      submenu: [
        {
          label: menuItemLabel.undo,
          accelerator: 'Command+Z',
          selector: 'undo:',
        },
        {
          label: menuItemLabel.redo,
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: menuItemLabel.cut,
          accelerator: 'Command+X',
          selector: 'cut:',
        },
        {
          label: menuItemLabel.copy,
          accelerator: 'Command+C',
          selector: 'copy:',
        },
        {
          label: menuItemLabel.paste,
          accelerator: 'Command+V',
          selector: 'paste:',
        },
        {
          label: menuItemLabel.selectAll,
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuView: MenuItemConstructorOptions = {
      label: menuItemLabel.view,
      submenu: [
        {
          label: menuItemLabel.showHideSidebar,
          click: () => mainWindow?.webContents.send('toogle-sidebar'),
        },
        {
          label: menuItemLabel.toggleFullScreen,
          accelerator: 'Ctrl+Command+F',
          click: () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()),
        },
      ],
    };
    const subMenuNavigation: MenuItemConstructorOptions = {
      label: menuItemLabel.navigate,
      submenu: [
        {
          label: menuItemLabel.all,
          click: () => mainWindow?.webContents.send('navigate', '/queueAll'),
        },
        {
          label: menuItemLabel.downloading,
          click: () => mainWindow?.webContents.send('navigate', '/queueDownloading'),
        },
        {
          label: menuItemLabel.completed,
          click: () => mainWindow?.webContents.send('navigate', '/queueFinished'),
        },
        {
          label: menuItemLabel.active,
          click: () => mainWindow?.webContents.send('navigate', '/queueActive'),
        },
        {
          label: menuItemLabel.inactive,
          click: () => mainWindow?.webContents.send('navigate', '/queueInactive'),
        },
        {
          label: menuItemLabel.stopped,
          click: () => mainWindow?.webContents.send('navigate', '/queueStopped'),
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: menuItemLabel.window,
      submenu: [
        {
          label: menuItemLabel.minimize,
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          label: menuItemLabel.zoom,
          selector: 'performZoom:',
        },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: menuItemLabel.help,
      submenu: [
        {
          label: menuItemLabel.openYaddsWebsite,
          click: () => shell.openExternal('https://github.com/shensven/Yadds'),
        },
        {
          type: 'separator',
        },
        {
          label: menuItemLabel.openYaddsRepository,
          click: () => shell.openExternal('https://github.com/shensven/Yadds'),
        },
        {
          label: menuItemLabel.reportABug,
          click: () => shell.openExternal('https://github.com/shensven/Yadds/issues'),
        },
      ],
    };
    const subMenuDev: MenuItemConstructorOptions = {
      label: 'Dev',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => mainWindow?.webContents.reload(),
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
      ],
    };

    return isDevelopment
      ? [subMenuAbout, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp, subMenuDev]
      : [subMenuAbout, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp];
  };

  if (isDarwin) {
    const template = buildDarwinTemplate();
    applicationMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(applicationMenu);
  }
});

ipcMain.handle('set-tray', async (_, args) => {
  const { showMainWindow, quit } = args;
  const contextMenu = Menu.buildFromTemplate([
    { type: 'normal', label: showMainWindow, click: () => mainWindow?.show() },
    { type: 'separator' },
    { type: 'normal', label: quit, click: () => app.exit() },
  ]);

  const trayIcon = isDevelopment
    ? nativeImage.createFromPath(getAssetPath('trayDevTemplate.png'))
    : nativeImage.createFromPath(getAssetPath('trayTemplate.png'));

  if (!tray) {
    // Init system's tary
    tray = new Tray(trayIcon);
    if (isWin32) {
      tray.setToolTip('Yadds');
    }
    tray.setContextMenu(contextMenu);
  } else {
    tray.setContextMenu(contextMenu);
  }

  tray.on('click', () => {
    if (isWin32) {
      mainWindow?.show();
    }
  });
});

ipcMain.handle('dark-mode:light', async () => {
  nativeTheme.themeSource = 'light';
  if (isWin32) {
    mainWindow?.setBackgroundColor('#f3f3f3');
  }
});
ipcMain.handle('dark-mode:dark', async () => {
  nativeTheme.themeSource = 'dark';
  if (isWin32) {
    mainWindow?.setBackgroundColor('#202020');
  }
});
ipcMain.handle('dark-mode:system', async () => {
  nativeTheme.themeSource = 'system';
  if (isWin32) {
    if (nativeTheme.shouldUseDarkColors) {
      mainWindow?.setBackgroundColor('#202020'); // Dark background
    } else {
      mainWindow?.setBackgroundColor('#f3f3f3'); // Light background
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

ipcMain.handle('popup-context-menu', async (_, props) => {
  Menu.buildFromTemplate(props).popup();
});

ipcMain.handle('open-via-broswer', async (_, url) => {
  shell.openExternal(url);
});

ipcMain.on('axios-auth', async (event, quickConnectID: string, account: string, passwd: string) => {
  const respData = await auth(quickConnectID, account, passwd);
  event.sender.send('axios-auth-reply', respData);
});
