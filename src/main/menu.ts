import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  menuItemLabel = {
    aboutYadds: '',
    checkForUpdates: '',
    preferences: '',
    services: '',
    hideYadds: '',
    hideOthers: '',
    quitYadds: '',
    edit: '',
    undo: '',
    redo: '',
    cut: '',
    copy: '',
    paste: '',
    selectAll: '',
    view: '',
    showHideSidebar: '',
    toggleFullScreen: '',
    navigate: '',
    all: '',
    downloading: '',
    completed: '',
    active: '',
    inactive: '',
    stopped: '',
    window: '',
    minimize: '',
    zoom: '',
    help: '',
    openYaddsWebsite: '',
    openYaddsRepository: '',
    reportABug: '',
  };

  constructor(mainWindow: BrowserWindow, args: any) {
    this.mainWindow = mainWindow;

    this.menuItemLabel = {
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
  }

  buildMenu(): Menu {
    const template = process.platform === 'darwin' ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: this.menuItemLabel.aboutYadds,
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          label: this.menuItemLabel.checkForUpdates,
        },
        {
          label: this.menuItemLabel.preferences,
          accelerator: 'Command+,',
          click: () => this.mainWindow.webContents.send('navigate', '/settings'),
        },
        {
          type: 'separator',
        },
        {
          label: this.menuItemLabel.services,
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: this.menuItemLabel.hideYadds,
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: this.menuItemLabel.hideOthers,
          accelerator: 'Command+Option+H',
          selector: 'hideOtherApplications:',
        },
        {
          type: 'separator',
        },
        {
          label: this.menuItemLabel.quitYadds,
          accelerator: 'Command+Q',
          click: () => app.exit(),
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: this.menuItemLabel.edit,
      submenu: [
        {
          label: this.menuItemLabel.undo,
          accelerator: 'Command+Z',
          selector: 'undo:',
        },
        {
          label: this.menuItemLabel.redo,
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          label: this.menuItemLabel.cut,
          accelerator: 'Command+X',
          selector: 'cut:',
        },
        {
          label: this.menuItemLabel.copy,
          accelerator: 'Command+C',
          selector: 'copy:',
        },
        {
          label: this.menuItemLabel.paste,
          accelerator: 'Command+V',
          selector: 'paste:',
        },
        {
          label: this.menuItemLabel.selectAll,
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuView: MenuItemConstructorOptions = {
      label: this.menuItemLabel.view,
      submenu: [
        {
          label: this.menuItemLabel.showHideSidebar,
          click: () => this.mainWindow.webContents.send('toogle-sidebar'),
        },
        {
          label: this.menuItemLabel.toggleFullScreen,
          accelerator: 'Ctrl+Command+F',
          click: () => this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()),
        },
      ],
    };
    const subMenuNavigation: MenuItemConstructorOptions = {
      label: this.menuItemLabel.navigate,
      submenu: [
        {
          label: this.menuItemLabel.all,
          click: () => this.mainWindow.webContents.send('navigate', '/queueAll'),
        },
        {
          label: this.menuItemLabel.downloading,
          click: () => this.mainWindow.webContents.send('navigate', '/queueDownloading'),
        },
        {
          label: this.menuItemLabel.completed,
          click: () => this.mainWindow.webContents.send('navigate', '/queueFinished'),
        },
        {
          label: this.menuItemLabel.active,
          click: () => this.mainWindow.webContents.send('navigate', '/queueActive'),
        },
        {
          label: this.menuItemLabel.inactive,
          click: () => this.mainWindow.webContents.send('navigate', '/queueInactive'),
        },
        {
          label: this.menuItemLabel.stopped,
          click: () => this.mainWindow.webContents.send('navigate', '/queueStopped'),
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: this.menuItemLabel.window,
      submenu: [
        {
          label: this.menuItemLabel.minimize,
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          label: this.menuItemLabel.zoom,
          selector: 'performZoom:',
        },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: this.menuItemLabel.help,
      submenu: [
        {
          label: this.menuItemLabel.openYaddsWebsite,
          click: () => shell.openExternal('https://github.com/shensven/Yadds'),
        },
        {
          type: 'separator',
        },
        {
          label: this.menuItemLabel.reportABug,
          click: () => shell.openExternal('https://github.com/shensven/Yadds'),
        },
        {
          label: this.menuItemLabel.openYaddsRepository,
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
          click: () => this.mainWindow.webContents.reload(),
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => this.mainWindow.webContents.toggleDevTools(),
        },
      ],
    };

    return process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
      ? [subMenuAbout, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp, subMenuDev]
      : [subMenuAbout, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => this.mainWindow.close(),
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => this.mainWindow.webContents.reload(),
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()),
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => this.mainWindow.webContents.toggleDevTools(),
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()),
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click: () => shell.openExternal('https://electronjs.org'),
          },
          {
            label: 'Documentation',
            clickL: () => shell.openExternal('https://github.com/electron/electron/tree/main/docs#readme'),
          },
          {
            label: 'Community Discussions',
            click: () => shell.openExternal('https://www.electronjs.org/community'),
          },
          {
            label: 'Search Issues',
            click: () => shell.openExternal('https://github.com/electron/electron/issues'),
          },
        ],
      },
    ];

    return templateDefault;
  }
}
