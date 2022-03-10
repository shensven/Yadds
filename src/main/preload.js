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

  toogleSidebar: (hasYaddsDrawer, persistHasYaddsDrawer) => {
    ipcRenderer.removeAllListeners('toogle-sidebar');
    ipcRenderer.on('toogle-sidebar', () => {
      persistHasYaddsDrawer(!hasYaddsDrawer);
    });
  },

  navigateTo: (navigateViaReact, persistYaddsDrawerCategory) => {
    ipcRenderer.on('navigate', (_, ...arg) => {
      navigateViaReact(...arg);
      persistYaddsDrawerCategory(...arg);
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
