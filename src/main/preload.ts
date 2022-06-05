import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { NavigateFunction } from 'react-router-dom';
import { MenuItemLabelsForApp } from '../renderer/utils/createMenuItemLabelsForApp';
import { MenuItemLabelsForTray } from '../renderer/utils/createMenuItemLabelsForTray';
import { MenuItemLabelsForQueue } from '../renderer/utils/createMenuItemLabelsForQueue';
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

  os: {
    get: () => {
      return ipcRenderer.sendSync('os:get');
    },
  },

  app: {
    getVersion: () => {
      return ipcRenderer.sendSync('app:get-version');
    },
    openURL: (url: string) => {
      ipcRenderer.invoke('app:open-url', url);
    },
    zoomWindow: () => {
      ipcRenderer.invoke('app:zoom-window');
    },
    toggleNativeTheme: (appearance: Appearance) => {
      ipcRenderer.invoke(`app:set-${appearance}-mode`);
    },
  },

  store: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store:get', key);
    },
    set(key: string, val: unknown) {
      ipcRenderer.send('electron-store:set', key, val);
    },
  },

  topMenuForApp: {
    create: (args: MenuItemLabelsForApp) => {
      ipcRenderer.invoke('top-menu-for-app:create', args);
    },
  },

  contextMenuForTray: {
    create: (args: MenuItemLabelsForTray) => {
      ipcRenderer.invoke('ctx-menu-for-tray:create', args);
    },
  },

  contextMenuForQueue: {
    create: (args: MenuItemLabelsForQueue) => {
      ipcRenderer.invoke('ctx-menu-for-queue:create', args);
    },
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

  yadds: {
    toogleSidebar: (hasSidebar: boolean, setHasSidebar: (update: boolean) => void) => {
      ipcRenderer.removeAllListeners('yadds:toogle-sidebar');
      ipcRenderer.on('yadds:toogle-sidebar', () => {
        setHasSidebar(!hasSidebar);
      });
    },

    toogleSidebarMarginTop: (setHasSidebarMarginTop: (update: boolean) => void) => {
      ipcRenderer.removeAllListeners('yadds:toogle-sidebar-mt');
      ipcRenderer.on('yadds:toogle-sidebar-mt', (_, arg: boolean) => {
        setHasSidebarMarginTop(arg);
      });
    },

    navigate: (navigateFunc: NavigateFunction, setSidebarCategory: (update: SidebarCategory) => void) => {
      ipcRenderer.on('yadds:navigate', (_, arg: SidebarCategory) => {
        navigateFunc(arg);
        setSidebarCategory(arg);
      });
    },
  },

  queue: {
    orderBy: (setQueueIterater: (update: string) => void) => {
      ipcRenderer.on('queue:order-by', (_, arg: string) => {
        setQueueIterater(arg);
      });
    },
    isAscend: (setQueueIsAscend: (update: boolean) => void) => {
      ipcRenderer.on('queue:is-ascend', (_, arg: boolean) => {
        setQueueIsAscend(arg);
      });
    },
  },

  net: {
    auth(args: any) {
      return ipcRenderer.invoke('net:auth', args);
    },
    poll(args: any) {
      return ipcRenderer.invoke('net:poll', args);
    },
    getDsmInfo(args: any) {
      return ipcRenderer.invoke('net:get-dsm-info', args);
    },
    getQuata(args: any) {
      return ipcRenderer.invoke('net:get-quota', args);
    },
  },
});
