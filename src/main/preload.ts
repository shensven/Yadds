import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { NavigateFunction } from 'react-router-dom';
import { TFunction } from 'react-i18next';
import { AppMenuItem } from '../renderer/utils/appMenuItemHandler';
import { ContextMenuItem } from '../renderer/utils/contextMenuItemHandler';
import { MenuItemConstructorOptionsForQuota } from '../renderer/utils/createMenuItemConstructorOptionsForQuota';
import { Appearance, SidebarCategory } from '../renderer/atoms/atomUI';
import { PageServerQuotaTargetItem } from '../renderer/atoms/atomTask';

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

  setAppMenu: (args: AppMenuItem) => {
    ipcRenderer.invoke('set-application-menu', args);
  },

  setTray: (t: TFunction) => {
    const menuItemLabel = {
      showMainWindow: t('tray.show_main_window'),
      quit: t('tray.quit'),
    };
    ipcRenderer.invoke('set-tray', menuItemLabel);
  },

  setContextMenu: (args: ContextMenuItem) => {
    ipcRenderer.invoke('set-context-menu', args);
  },

  contextMenuForQuota: {
    create: (args: MenuItemConstructorOptionsForQuota) => {
      ipcRenderer.invoke('ctx-menu-for-quota:create', args);
    },
    setTargetItem: (setPageServerQuotaTargetItem: (update: PageServerQuotaTargetItem) => void) => {
      ipcRenderer.on('ctx-menu-for-quota:set-target-item', (_, arg: PageServerQuotaTargetItem) => {
        setPageServerQuotaTargetItem(arg);
      });
    },
  },

  order: {
    byIterater: (setQueueIterater: (update: string) => void) => {
      ipcRenderer.on('order-by-iterater', (_, arg: string) => {
        setQueueIterater(arg);
      });
    },
    isAscend: (setQueueIsAscend: (update: boolean) => void) => {
      ipcRenderer.on('order-is-ascend', (_, arg: boolean) => {
        setQueueIsAscend(arg);
      });
    },
  },

  toggleNativeTheme: (appearance: Appearance) => {
    ipcRenderer.invoke(`dark-mode:${appearance}`);
  },

  zoomWindow: () => {
    ipcRenderer.invoke('zoom-window');
  },

  toogleSidebar: (hasSidebar: boolean, setHasSidebar: (update: boolean) => void) => {
    ipcRenderer.removeAllListeners('toogle-sidebar');
    ipcRenderer.on('toogle-sidebar', () => {
      setHasSidebar(!hasSidebar);
    });
  },

  toogleSidebarMarginTop: (setHasSidebarMarginTop: (update: boolean) => void) => {
    ipcRenderer.removeAllListeners('toogle-sidebar-mt');
    ipcRenderer.on('toogle-sidebar-mt', (_, arg: boolean) => {
      setHasSidebarMarginTop(arg);
    });
  },

  navigateTo: (navigateViaReact: NavigateFunction, setSidebarCategory: (update: SidebarCategory) => void) => {
    ipcRenderer.on('navigate', (_, arg: SidebarCategory) => {
      navigateViaReact(arg);
      setSidebarCategory(arg);
    });
  },

  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store:get', key);
    },
    set(key: string, val: unknown) {
      ipcRenderer.send('electron-store:set', key, val);
    },
  },

  getOS: () => {
    return ipcRenderer.sendSync('get-os-platform');
  },

  getAppVersion: () => {
    return ipcRenderer.sendSync('get-app-version');
  },

  openViaBrowser: (url: string) => {
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
      return ipcRenderer.invoke('net-get-dsm-info', args);
    },
    getQuata(args: any) {
      return ipcRenderer.invoke('net-get-quota', args);
    },
  },
});
