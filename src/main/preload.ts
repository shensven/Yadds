import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { YaddsCache } from './store/cache';
import { YaddsPreferences } from './store/preferences';
import { YaddsConnectedUsers } from './store/connectedUsers';
import { MenuItemsInApp } from '../renderer/utils/useMenuForApp';
import { Nav } from '../renderer/utils/useNav';
import { MenuItemsInTray } from '../renderer/utils/useMenuForTray';
import { MenuItemsInQueue } from '../renderer/utils/useMenuForQueue';
import { Appearance, SidebarCategory } from '../renderer/atoms/atomUI';
import { PropQuickConnectID } from './net/getServerAddres';
import { PropsAuthType } from './net/getAuthType';
import { PropsSignIn } from './net/signIn';

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
    create: (args: MenuItemsInApp) => {
      ipcRenderer.invoke('top-menu-for-app:create', args);
    },
  },

  contextMenuForTray: {
    create: (args: MenuItemsInTray) => {
      ipcRenderer.invoke('ctx-menu-for-tray:create', args);
    },
  },

  contextMenuForQueue: {
    create: (args: MenuItemsInQueue) => {
      ipcRenderer.invoke('ctx-menu-for-queue:create', args);
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

    navigate: (nav: Nav) => {
      ipcRenderer.on('yadds:navigate', (_, arg: SidebarCategory) => {
        nav(arg);
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
    getServerAddress(prop: PropQuickConnectID) {
      return ipcRenderer.invoke('net:get-server-address', prop);
    },
    getAuthType(props: PropsAuthType) {
      return ipcRenderer.invoke('net:get-auth-type', props);
    },
    signIn(props: PropsSignIn) {
      return ipcRenderer.invoke('net:sign-in', props);
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
    getVolume(args: any) {
      return ipcRenderer.invoke('net:get-volume', args);
    },
  },
});
