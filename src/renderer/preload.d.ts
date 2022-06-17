import { NavigateFunction } from 'react-router-dom';
import { Channels } from 'main/preload';
import { YaddsCache } from '../main/store/cache';
import { YaddsPreferences } from '../main/store/preferences';
import { YaddsConnectedUsers } from '../main/store/connectedUsers';
import { ServerError } from '../main/net/getServerInfo';
import { SignInInfo, SignInWrongAccountOrPasswd } from '../main/net/signIn';
import { Appearance, QueueIterater, SidebarCategory, TargeMenuItemForQuota } from './atoms/atomUI';
import { MenuItemsInApp } from './utils/useMenuInApp';
import { MenuItemsInTray } from './utils/useMenuInTray';
import { MenuItemsInQueue } from './utils/useMenuForQueue';
import { MenuItemConstructorOptionsForQuota } from './utils/createMenuItemConstructorOptionsForQuota';
import { TasksError, TasksInfo } from '../main/net/poll';
import { DsmInfo } from '../main/net/getDsmInfo';
import { PersonalSettingsInfo } from '../main/net/getQuota';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };

      cache: {
        get: (key: keyof YaddsCache) => unknown;
        set: (key: keyof YaddsCache, val: unknown) => void;
      };

      preferences: {
        get: (key: keyof YaddsPreferences) => unknown;
        set: (key: keyof YaddsPreferences, val: unknown) => void;
      };

      connectedUsers: {
        get: (key: keyof YaddsConnectedUsers) => unknown;
        set: (key: keyof YaddsConnectedUsers, val: unknown) => void;
      };

      os: {
        get: () => 'darwin' | 'win32' | 'linux';
      };

      app: {
        getVersion: () => string;
        openURL: (url: string) => void;
        zoomWindow: () => void;
        toggleNativeTheme: (update: Appearance) => void;
      };

      topMenuForApp: {
        create: (update: MenuItemsInApp) => void;
      };

      contextMenuForTray: {
        create: (update: MenuItemsInTray) => void;
      };

      contextMenuForQueue: {
        create: (update: MenuItemsInQueue) => void;
      };

      contextMenuForQuota: {
        create: (update: MenuItemConstructorOptionsForQuota) => void;
        setTargetItem: (setTargeMenuItemForQuota: (update: TargeMenuItemForQuota) => void) => void;
      };

      yadds: {
        toogleSidebar: (hasSidebar: boolean, setHasSidebar: (hasSidebar: boolean) => void) => void;
        toogleSidebarMarginTop: (setHasSidebarMarginTop: (update: boolean) => void) => void;
        navigate: (navigateFunc: NavigateFunction, setSidebarCategory: (update: SidebarCategory) => void) => void;
      };

      queue: {
        orderBy: (setQueueIterater: (update: QueueIterater) => void) => void;
        isAscend: (setQueueIsAscend: (updaet: boolean) => void) => void;
      };

      net: {
        auth: (props: {
          quickConnectID: string;
          account: string;
          passwd: string;
        }) => Promise<ServerError | SignInWrongAccountOrPasswd | SignInInfo>;

        poll: (props: { host: string; port: number; sid: string }) => Promise<TasksError | TasksInfo>;

        getDsmInfo: (props: { host: string; port: number; sid: string }) => Promise<DsmInfo>;

        getQuata: (props: { host: string; port: number; sid: string }) => Promise<PersonalSettingsInfo>;
      };
    };
  }
}

export {};
