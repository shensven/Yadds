import { NavigateFunction } from 'react-router-dom';
import { Channels } from 'main/preload';
import { ServerError } from 'main/net/getServerInfo';
import { SignInInfo, SignInWrongAccountOrPasswd } from 'main/net/signIn';
import { Appearance, QueueIterater, SidebarCategory } from './atoms/atomUI';
import { PageServerQuotaTargetItem } from './atoms/atomTask';
import { MenuItemLabelsForApp } from './utils/createMenuItemLabelsForApp';
import { MenuItemLabelsForTray } from './utils/createMenuItemLabelsForTray';
import { MenuItemLabelsForQueue } from './utils/createMenuItemLabelsForQueue';
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
      toggleNativeTheme: (update: Appearance) => void;

      topMenuForApp: {
        create: (update: MenuItemLabelsForApp) => void;
      };

      contextMenuForTray: {
        create: (update: MenuItemLabelsForTray) => void;
      };

      contextMenuForQueue: {
        create: (update: MenuItemLabelsForQueue) => void;
      };

      contextMenuForQuota: {
        create: (update: MenuItemConstructorOptionsForQuota) => void;
        setTargetItem: (setPageServerQuotaTarget: (update: PageServerQuotaTargetItem) => void) => void;
      };

      queue: {
        orderBy: (setQueueIterater: (update: QueueIterater) => void) => void;
        isAscend: (setQueueIsAscend: (updaet: boolean) => void) => void;
      };

      zoomWindow: () => void;

      toogleSidebar: (hasYaddsSidebar: boolean, setHasYaddsSidebar: (hasYaddsSidebar: boolean) => void) => void;

      toogleSidebarMarginTop: (setHasSidebarMarginTop: (update: boolean) => void) => void;

      navigateTo: (navigateViaReact: NavigateFunction, setSidebarCategory: (update: SidebarCategory) => void) => void;

      store: {
        get: (key: string) => unknown;
        set: (key: string, val: unknown) => void;
      };

      getOS: () => 'darwin' | 'win32' | 'linux';

      getAppVersion: () => string;

      openViaBrowser: (url: string) => void;

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
