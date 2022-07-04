/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
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
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { isDarwin, isDebug, isLinux, isProduction, isWin32, resolveHtmlPath } from './util';
import cache, { YaddsCache } from './store/cache';
import preferences, { YaddsPreferences } from './store/preferences';
import connectedUsers, { YaddsConnectedUsers } from './store/connectedUsers';
import { MenuItemsInApp } from '../renderer/utils/useMenuForApp';
import { MenuItemsInTray } from '../renderer/utils/useMenuForTray';
import { MenuItemsInQueue } from '../renderer/utils/useMenuForQueue';
import { Appearance } from '../renderer/atoms/atomUI';
import getServerAddress, { PropQuickConnectID } from './net/getServerAddres';
import getAuthType, { PropsAuthType } from './net/getAuthType';
import signIn, { PropsSignIn } from './net/signIn';
import getDsmInfo from './net/getDsmInfo';
import getQuota from './net/getQuota';
import getVolume from './net/getVolume';
import poll from './net/poll';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

if (isDebug) {
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
  if (isDebug) {
    const isForceDownload = !!process.env.UPGRADE_EXTENSIONS;
    await installExtension(REACT_DEVELOPER_TOOLS, isForceDownload);
  }

  switch (process.platform) {
    case 'darwin':
      mainWindow = new BrowserWindow({
        show: false,
        x: (cache.get('windowBounds.x') as number) || undefined,
        y: (cache.get('windowBounds.y') as number) || undefined,
        width: (cache.get('windowBounds.width') as number) || 990,
        height: (cache.get('windowBounds.height') as number) || 720,
        minWidth: 990,
        minHeight: 720,
        titleBarStyle: 'hidden',
        // trafficLightPosition: { x: 19, y: 19 },
        vibrancy: 'sidebar',
        icon: getAssetPath('icon_darwin.png'),
        webPreferences: {
          preload: app.isPackaged
            ? path.join(__dirname, 'preload.js')
            : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
      });
      break;
    case 'win32':
      mainWindow = new BrowserWindow({
        show: false,
        x: (cache.get('windowBounds.x') as number) || undefined,
        y: (cache.get('windowBounds.y') as number) || undefined,
        width: (cache.get('windowBounds.width') as number) || 990 + 16,
        height: (cache.get('windowBounds.height') as number) || 720,
        minWidth: 990 + 16, // The min-width will be smaller, workaround on Microsoft Buuuuuugdows platforms!!!
        minHeight: 720,
        backgroundColor: '#e6e6e6',
        icon: getAssetPath('icon_win32.png'),
        webPreferences: {
          preload: app.isPackaged
            ? path.join(__dirname, 'preload.js')
            : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
      });
      break;
    case 'linux':
      mainWindow = new BrowserWindow({
        show: false,
        x: (cache.get('windowBounds.x') as number) || undefined,
        y: (cache.get('windowBounds.y') as number) || undefined,
        width: (cache.get('windowBounds.width') as number) || 990,
        height: (cache.get('windowBounds.height') as number) || 720,
        minWidth: 990,
        minHeight: 720,
        backgroundColor: '#e6e6e6',
        webPreferences: {
          preload: app.isPackaged
            ? path.join(__dirname, 'preload.js')
            : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
      });
      break;
    default:
      mainWindow = new BrowserWindow({
        show: false,
        x: (cache.get('windowBounds.x') as number) || undefined,
        y: (cache.get('windowBounds.y') as number) || undefined,
        width: (cache.get('windowBounds.width') as number) || 990,
        height: (cache.get('windowBounds.height') as number) || 720,
        minWidth: 990,
        minHeight: 720,
        backgroundColor: '#e6e6e6',
        webPreferences: {
          preload: app.isPackaged
            ? path.join(__dirname, 'preload.js')
            : path.join(__dirname, '../../.erb/dll/preload.js'),
        },
      });
  }

  mainWindow.menuBarVisible = false;

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else if (cache.get('isMaximized') as boolean | undefined) {
      mainWindow.maximize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('moved', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      cache.set('windowBounds', bounds);
    }
  });

  mainWindow.on('resized', () => {
    if (mainWindow) {
      const bounds = mainWindow.getBounds();
      cache.set('windowBounds', bounds);
    }
  });

  mainWindow.on('maximize', () => {
    if (mainWindow) {
      cache.set('isMaximized', true);
    }
  });

  mainWindow.on('unmaximize', () => {
    if (mainWindow) {
      cache.set('isMaximized', false);
    }
  });

  mainWindow.on('enter-full-screen', () => {
    if (mainWindow) {
      mainWindow.webContents.send('yadds:toogle-sidebar-mt', false);
      cache.set('isFullScreened', true);
    }
  });

  mainWindow.on('leave-full-screen', () => {
    if (mainWindow) {
      mainWindow.webContents.send('yadds:toogle-sidebar-mt', true);
      cache.set('isFullScreened', false);
    }
  });

  let willQuitApp = false;
  mainWindow.on('close', (evt) => {
    if (willQuitApp) {
      app.exit();
    } else if (cache.get('isFullScreened')) {
      mainWindow?.setFullScreen(false);
      evt.preventDefault();
    } else {
      evt.preventDefault();
      mainWindow?.hide();
    }
  });
  app.on('before-quit', () => {
    willQuitApp = true;
  });

  if (isDebug) {
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
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

//------------------------------------------------------------------------------
// Initialize the default configuration of this application

nativeTheme.themeSource = (preferences.get('appearance') as Appearance | undefined) ?? 'system';

app.applicationMenu = null;

//------------------------------------------------------------------------------
// When Electron has finished initializing, create the main window.

const lock = app.requestSingleInstanceLock();

if (!lock) {
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

ipcMain.on('ipc-example', async (evt, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  evt.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('top-menu-for-app:create', async (_, args: MenuItemsInApp) => {
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
          click: () => mainWindow?.webContents.send('yadds:navigate', '/preferences'),
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
        { label: args.showHideSidebar, click: () => mainWindow?.webContents.send('yadds:toogle-sidebar') },
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
        { label: args.all, click: () => mainWindow?.webContents.send('yadds:navigate', '/queueAll') },
        { label: args.downloading, click: () => mainWindow?.webContents.send('yadds:navigate', '/queueDownloading') },
        { label: args.completed, click: () => mainWindow?.webContents.send('yadds:navigate', '/queueFinished') },
        { label: args.active, click: () => mainWindow?.webContents.send('yadds:navigate', '/queueActive') },
        { label: args.inactive, click: () => mainWindow?.webContents.send('yadds:navigate', '/queueInactive') },
        { label: args.stopped, click: () => mainWindow?.webContents.send('yadds:navigate', '/queueStopped') },
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

    return isDebug
      ? [subMenuAbout, subMenuFile, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp, subMenuDev]
      : [subMenuAbout, subMenuFile, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp];
  };

  if (isDarwin) {
    const template = buildDarwinTemplate();
    const applicationMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(applicationMenu);
  }
});

ipcMain.handle('ctx-menu-for-tray:create', async (_, args: MenuItemsInTray) => {
  const devMenu: MenuItemConstructorOptions[] = [
    { label: 'Reload', click: () => mainWindow?.webContents.reload() },
    { label: 'Toggle Developer Tools', click: () => mainWindow?.webContents.toggleDevTools() },
    { type: 'separator' },
  ];
  const normalMenu: MenuItemConstructorOptions[] = [
    {
      label: args.showMainWindow,
      click: () => {
        if (isDarwin) {
          mainWindow?.show();
        }
        if (isWin32 || isLinux) {
          if (cache.get('isMaximized')) {
            mainWindow?.maximize();
          } else {
            mainWindow?.show();
          }
        }
      },
    },
    { type: 'separator' },
    { label: args.quit, click: () => app.exit() },
  ];

  const contextMenu = Menu.buildFromTemplate(
    isDebug && (isWin32 || isLinux) ? [...devMenu, ...normalMenu] : normalMenu
  );

  const getTrayIcon = () => {
    switch (process.platform) {
      case 'darwin':
        return isDebug
          ? nativeImage.createFromPath(getAssetPath('tray/darwin/trayDevTemplate.png'))
          : nativeImage.createFromPath(getAssetPath('tray/darwin/trayTemplate.png'));
      case 'win32':
        return isDebug
          ? nativeImage.createFromPath(getAssetPath('tray/win32/trayDev@2x.png')).resize({ width: 16, height: 16 })
          : nativeImage.createFromPath(getAssetPath('tray/win32/tray@2x.png')).resize({ width: 16, height: 16 });
      case 'linux':
        return isDebug
          ? nativeImage.createFromPath(getAssetPath('tray/linux/trayDev@2x.png')).resize({ width: 16, height: 16 })
          : nativeImage.createFromPath(getAssetPath('tray/linux/tray@2x.png')).resize({ width: 16, height: 16 });
      default:
        return isDebug
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
      if (cache.get('isMaximized')) {
        mainWindow?.maximize();
      } else {
        mainWindow?.show();
      }
    }
  });
});

ipcMain.handle('ctx-menu-for-queue:create', async (_, args: MenuItemsInQueue) => {
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
          checked: args.queueIterater === 'date',
          click: () => mainWindow?.webContents.send('queue:order-by', 'date'),
        },
        {
          label: args.title,
          type: 'radio',
          checked: args.queueIterater === 'title',
          click: () => mainWindow?.webContents.send('queue:order-by', 'title'),
        },
        {
          label: args.downloadProgress,
          type: 'radio',
          checked: args.queueIterater === 'download_progress',
          click: () => mainWindow?.webContents.send('queue:order-by', 'download_progress'),
        },
        {
          label: args.downloadSpeed,
          type: 'radio',
          checked: args.queueIterater === 'download_speed',
          click: () => mainWindow?.webContents.send('queue:order-by', 'download_speed'),
        },
        { type: 'separator' },
        {
          label: args.ascending,
          type: 'radio',
          checked: args.queueIsAscend,
          click: () => mainWindow?.webContents.send('queue:is-ascend', true),
        },
        {
          label: args.descending,
          type: 'radio',
          checked: !args.queueIsAscend,
          click: () => mainWindow?.webContents.send('queue:is-ascend', false),
        },
      ],
    },
  ];

  Menu.buildFromTemplate(template).popup();
});

ipcMain.on('cache:get', async (evt, key: keyof YaddsCache) => {
  evt.returnValue = cache.get(key);
});

ipcMain.on('cache:set', async (_, key: keyof YaddsCache, val: unknown) => {
  cache.set(key, val);
});

ipcMain.on('preferences:get', async (evt, key: keyof YaddsPreferences) => {
  evt.returnValue = preferences.get(key);
});

ipcMain.on('preferences:set', async (_, key: keyof YaddsPreferences, val: unknown) => {
  preferences.set(key, val);
});

ipcMain.on('connectedUsers:get', async (evt, key: keyof YaddsConnectedUsers) => {
  evt.returnValue = connectedUsers.get(key);
});

ipcMain.on('connectedUsers:set', async (_, key: keyof YaddsConnectedUsers, val: unknown) => {
  connectedUsers.set(key, val);
});

ipcMain.on('os:get', async (evt) => {
  evt.returnValue = process.platform;
});

ipcMain.on('app:get-version', async (evt) => {
  evt.returnValue = app.getVersion();
});

ipcMain.handle('app:open-url', async (_, url: string) => {
  await shell.openExternal(url);
});

ipcMain.handle('app:zoom-window', async () => {
  if (mainWindow?.isMaximized()) {
    mainWindow?.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('app:set-light-mode', async () => {
  nativeTheme.themeSource = 'light';
  if (isWin32) {
    mainWindow?.setBackgroundColor('#e6e6e6');
  }
});
ipcMain.handle('app:set-dark-mode', async () => {
  nativeTheme.themeSource = 'dark';
  if (isWin32) {
    mainWindow?.setBackgroundColor('#1f1f1f');
  }
});
ipcMain.handle('app:set-system-mode', async () => {
  nativeTheme.themeSource = 'system';
  if (isWin32) {
    if (nativeTheme.shouldUseDarkColors) {
      mainWindow?.setBackgroundColor('#1f1f1f'); // Dark background
    } else {
      mainWindow?.setBackgroundColor('#e6e6e6'); // Light background
    }
  }
});

ipcMain.handle('net:get-server-address', async (_, prop: PropQuickConnectID) => {
  return getServerAddress(prop);
});

ipcMain.handle('net:get-auth-type', async (_, props: PropsAuthType) => {
  return getAuthType(props);
});

ipcMain.handle('net:sign-in', async (_, props: PropsSignIn) => {
  return signIn(props);
});

ipcMain.handle('net:poll', async (_, args) => {
  return poll(args);
});

ipcMain.handle('net:get-dsm-info', async (_, args) => {
  return getDsmInfo(args);
});

ipcMain.handle('net:get-quota', async (_, args) => {
  return getQuota(args);
});

ipcMain.handle('net:get-volume', async (_, args) => {
  return getVolume(args);
});
