const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },

  setApplicationMenu: (t) => {
    const menuItemLabel = {
      aboutYadds: t('application_menu.darwin.about_yadds'),
      checkForUpdates: t('application_menu.darwin.check_for_updates'),
      preferences: t('application_menu.darwin.preferences'),
      services: t('application_menu.darwin.services'),
      hideYadds: t('application_menu.darwin.hide_yadds'),
      hideOthers: t('application_menu.darwin.hide_others'),
      quitYadds: t('application_menu.darwin.quit_yadds'),
      edit: t('application_menu.darwin.edit'),
      undo: t('application_menu.darwin.undo'),
      redo: t('application_menu.darwin.redo'),
      cut: t('application_menu.darwin.cut'),
      copy: t('application_menu.darwin.copy'),
      paste: t('application_menu.darwin.paste'),
      selectAll: t('application_menu.darwin.select_all'),
      view: t('application_menu.darwin.view'),
      showHideSidebar: t('application_menu.darwin.show_hide_sidebar'),
      toggleFullScreen: t('application_menu.darwin.toggle_full_screen'),
      navigate: t('application_menu.darwin.navigate'),
      all: t('application_menu.darwin.all'),
      downloading: t('application_menu.darwin.downloading'),
      completed: t('application_menu.darwin.completed'),
      active: t('application_menu.darwin.active'),
      inactive: t('application_menu.darwin.inactive'),
      stopped: t('application_menu.darwin.stopped'),
      window: t('application_menu.darwin.window'),
      minimize: t('application_menu.darwin.minimize'),
      zoom: t('application_menu.darwin.zoom'),
      help: t('application_menu.darwin.help'),
      openYaddsWebsite: t('application_menu.darwin.open_yadds_website'),
      openYaddsRepository: t('application_menu.darwin.open_yadds_repository'),
      reportABug: t('application_menu.darwin.report_a_bug'),
    };
    ipcRenderer.invoke('set-application-menu', menuItemLabel);
  },

  setTray: (t) => {
    const menuItemLabel = {
      showMainWindow: t('tray.show_main_window'),
      quit: t('tray.quit'),
    };
    ipcRenderer.invoke('set-tray', menuItemLabel);
  },

  toggleNativeTheme: (themeSource) => {
    ipcRenderer.invoke(`dark-mode:${themeSource}`);
  },

  zoomWindow: () => {
    ipcRenderer.invoke('zoom-window');
  },

  toogleSidebar: (hasYaddsSidebar, persistHasYaddsSidebar) => {
    ipcRenderer.removeAllListeners('toogle-sidebar');
    ipcRenderer.on('toogle-sidebar', () => {
      persistHasYaddsSidebar(!hasYaddsSidebar);
    });
  },

  toogleSidebarMarginTop: (hasYaddsSidebarMarginTop, setHasYaddsSidebarMarginTop) => {
    ipcRenderer.removeAllListeners('toogle-sidebar-mt');
    ipcRenderer.on('toogle-sidebar-mt', (_, ...arg) => {
      setHasYaddsSidebarMarginTop(...arg);
    });
  },

  navigateTo: (navigateViaReact, persistYaddsSidebarCategory) => {
    ipcRenderer.on('navigate', (_, ...arg) => {
      navigateViaReact(...arg);
      persistYaddsSidebarCategory(...arg);
    });
  },

  store: {
    get(val) {
      return ipcRenderer.sendSync('electron-store:get', val);
    },
    set(property, val) {
      ipcRenderer.send('electron-store:set', property, val);
    },
  },

  getOS: () => {
    return ipcRenderer.sendSync('get-os-platform');
  },

  getAppVersion: () => {
    return ipcRenderer.sendSync('get-app-version');
  },

  popupContextMenu: (props) => {
    ipcRenderer.invoke('popup-context-menu', props);
  },

  openViaBrowser: (url) => {
    ipcRenderer.invoke('open-via-broswer', url);
  },

  net: {
    auth(quickConnectID, account, passwd) {
      ipcRenderer.send('axios-auth', quickConnectID, account, passwd);
      ipcRenderer.once('axios-auth-reply', (event, arg) => {
        console.log(arg);
        return arg;
      });
    },
  },
});
