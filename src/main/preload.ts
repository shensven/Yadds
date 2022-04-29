import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  setApplicationMenu: (args: any) => {
    ipcRenderer.invoke('set-application-menu', args);
  },

  setTray: (t: any) => {
    const menuItemLabel = {
      showMainWindow: t('tray.show_main_window'),
      quit: t('tray.quit'),
    };
    ipcRenderer.invoke('set-tray', menuItemLabel);
  },

  setContextMenu: (args: any) => {
    ipcRenderer.invoke('set-context-menu', args);
  },

  order: {
    byIterater: (persistYaddsMainOrderIterater: any) => {
      ipcRenderer.on('order-by-iterater', (_, ...args) => {
        persistYaddsMainOrderIterater(...args);
      });
    },
    isAscend: (persistYaddsMainOrderIsAscend: any) => {
      ipcRenderer.on('order-is-ascend', (_, ...arg) => {
        persistYaddsMainOrderIsAscend(...arg);
      });
    },
  },

  toggleNativeTheme: (themeSource: any) => {
    ipcRenderer.invoke(`dark-mode:${themeSource}`);
  },

  zoomWindow: () => {
    ipcRenderer.invoke('zoom-window');
  },

  toogleSidebar: (hasYaddsSidebar: any, persistHasYaddsSidebar: any) => {
    ipcRenderer.removeAllListeners('toogle-sidebar');
    ipcRenderer.on('toogle-sidebar', () => {
      persistHasYaddsSidebar(!hasYaddsSidebar);
    });
  },

  toogleSidebarMarginTop: (setHasYaddsSidebarMarginTop: any) => {
    ipcRenderer.removeAllListeners('toogle-sidebar-mt');
    ipcRenderer.on('toogle-sidebar-mt', (_, ...arg) => {
      setHasYaddsSidebarMarginTop(...arg);
    });
  },

  navigateTo: (navigateViaReact: any, persistYaddsSidebarCategory: any) => {
    ipcRenderer.on('navigate', (_, ...arg) => {
      navigateViaReact(...arg);
      persistYaddsSidebarCategory(...arg);
    });
  },

  store: {
    get(val: any) {
      return ipcRenderer.sendSync('electron-store:get', val);
    },
    set(property: any, val: any) {
      ipcRenderer.send('electron-store:set', property, val);
    },
  },

  getOS: () => {
    return ipcRenderer.sendSync('get-os-platform');
  },

  getAppVersion: () => {
    return ipcRenderer.sendSync('get-app-version');
  },

  openViaBrowser: (url: any) => {
    ipcRenderer.invoke('open-via-broswer', url);
  },

  net: {
    auth(args: any) {
      return ipcRenderer.invoke('net-auth', args);
    },
    poll(args: any) {
      return ipcRenderer.invoke('net-poll', args);
    },
    getDsmInfo(args: any) {
      return ipcRenderer.invoke('net-get-info', args);
    },
  },
});
