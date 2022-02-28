import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment();
    }

    const template = process.platform === 'darwin' ? this.buildDarwinTemplate() : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => this.mainWindow.webContents.inspectElement(x, y),
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          // label: 'About ElectronReact',
          label: '关于 Yadds',
          selector: 'orderFrontStandardAboutPanel:',
        },
        {
          // label: 'Check for Updates',
          label: '检查更新',
        },
        {
          // label: 'Preferences',
          label: '偏好设置',
        },
        {
          type: 'separator',
        },
        {
          // label: 'Services',
          label: '服务',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          // label: 'Hide ElectronReact',
          label: '隐藏 Yadds',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          // label: 'Hide Others',
          label: '隐藏其他',
          accelerator: 'Command+Option+H',
          selector: 'hideOtherApplications:',
        },
        {
          type: 'separator',
        },
        {
          // label: 'Quit',
          label: '退出 Yadds',
          accelerator: 'Command+Q',
          click: () => app.exit(),
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      // label: 'Edit',
      label: '编辑',
      submenu: [
        {
          // label: 'Undo',
          label: '撤销',
          accelerator: 'Command+Z',
          selector: 'undo:',
        },
        {
          // label: 'Redo',
          label: '恢复',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
        },
        {
          type: 'separator',
        },
        {
          // label: 'Cut',
          label: '剪切',
          accelerator: 'Command+X',
          selector: 'cut:',
        },
        {
          // label: 'Copy',
          label: '复制',
          accelerator: 'Command+C',
          selector: 'copy:',
        },
        {
          // label: 'Paste',
          label: '粘贴',
          accelerator: 'Command+V',
          selector: 'paste:',
        },
        {
          // label: 'Select All',
          label: '全选',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      // label: 'View',
      label: '显示',
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
        {
          type: 'separator',
        },
        {
          // label: 'Toggle Full Screen',
          label: '进入全屏幕',
          accelerator: 'Ctrl+Command+F',
          click: () => this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()),
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      // label: 'View',
      label: '显示',
      submenu: [
        {
          // label: 'Toggle Full Screen',
          label: '进入全屏幕',
          accelerator: 'Ctrl+Command+F',
          click: () => this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen()),
        },
      ],
    };
    const subMenuNavigation: MenuItemConstructorOptions = {
      // label: 'Navigation',
      label: '前往',
      submenu: [
        {
          // label: 'Queue All',
          label: '全部下载项目',
        },
        {
          // label: 'Queue Downloading',
          label: '下载中',
        },
        {
          // label: 'Queue Finished',
          label: '已完成',
        },
        {
          // label: 'Queue Active',
          label: '进行中',
        },
        {
          // label: 'Queue Inactive',
          label: '非进行中',
        },
        {
          // label: 'Queue Stoped',
          label: '停用',
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      // label: 'Window',
      label: '窗口',
      submenu: [
        {
          // label: 'Minimize',
          label: '最小化',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          // label: 'Zoom',
          label: '缩放',
          selector: 'performZoom:',
        },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      // label: 'Help',
      label: '帮助',
      submenu: [
        {
          label: '访问官方网站',
          click: () => shell.openExternal('https://github.com/shensven/Yadds'),
        },
        {
          type: 'separator',
        },
        {
          label: '访问代码仓库',
          click: () => shell.openExternal('https://github.com/shensven/Yadds'),
        },
        {
          label: '发送反馈',
          click: () => shell.openExternal('https://github.com/shensven/Yadds/issues'),
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true' ? subMenuViewDev : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuNavigation, subMenuWindow, subMenuHelp];
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
