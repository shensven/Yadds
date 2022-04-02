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

  setApplicationMenu: (args) => {
    ipcRenderer.invoke('set-application-menu', args);
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
      return ipcRenderer.invoke('net-auth', quickConnectID, account, passwd);
    },
    poll(hostname, port, sid) {
      return ipcRenderer.invoke('net-poll', hostname, port, sid);
    },
  },
});
