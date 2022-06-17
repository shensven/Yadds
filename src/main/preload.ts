import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { NavigateFunction } from 'react-router-dom';
import { YaddsCache } from './store/cache';
import { YaddsPreferences } from './store/preferences';
import { YaddsConnectedUsers } from './store/connectedUsers';
import { MenuItemLabelsForApp } from '../renderer/utils/createMenuItemLabelsForApp';
import { MenuItemInTray } from '../renderer/utils/useMenuInTray';
import { MenuItemLabelsForQueue } from '../renderer/utils/createMenuItemLabelsForQueue';
import { MenuItemConstructorOptionsForQuota } from '../renderer/utils/createMenuItemConstructorOptionsForQuota';
import { Appearance, SidebarCategory, TargeMenuItemForQuota } from '../renderer/atoms/atomUI';

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

  cache: {
    get(key: keyof YaddsCache) {
      return ipcRenderer.sendSync('cache:get', key);
    },
    set(key: keyof YaddsCache, val: unknown) {
      ipcRenderer.send('cache:set', key, val);
    },
  },

  preferences: {
    get(key: keyof YaddsPreferences) {
      return ipcRenderer.sendSync('preferences:get', key);
    },
    set(key: keyof YaddsPreferences, val: unknown) {
      ipcRenderer.send('preferences:set', key, val);
    },
  },

  connectedUsers: {
    get(key: keyof YaddsConnectedUsers) {
      return ipcRenderer.sendSync('connectedUsers:get', key);
    },
    set(key: keyof YaddsConnectedUsers, val: unknown) {
      ipcRenderer.send('connectedUsers:set', key, val);
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

  topMenuForApp: {
    create: (args: MenuItemLabelsForApp) => {
      ipcRenderer.invoke('top-menu-for-app:create', args);
    },
  },

  contextMenuForTray: {
    create: (args: MenuItemInTray) => {
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
    setTargetItem: (setTargeMenuItemForQuota: (update: TargeMenuItemForQuota) => void) => {
      ipcRenderer.on('ctx-menu-for-quota:set-target-item', (_, arg: TargeMenuItemForQuota) => {
        setTargeMenuItemForQuota(arg);
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
