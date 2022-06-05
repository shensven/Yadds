import { TFunction } from 'react-i18next';
import { NavigateFunction } from 'react-router-dom';
import { Channels } from 'main/preload';
import { ServerError } from 'main/net/getServerInfo';
import { SignInInfo, SignInWrongAccountOrPasswd } from 'main/net/signIn';
import { Appearance, SidebarCategory } from './atoms/atomUI';
import { PageServerQuotaTargetItem } from './atoms/atomTask';
import { AppMenuItem } from './utils/appMenuItemHandler';
import { ContextMenuItem } from './utils/contextMenuItemHandler';
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

      setAppMenu: (update: AppMenuItem) => void;

      setTray: (t: TFunction) => void;

      setContextMenu: (update: ContextMenuItem) => void;

      contextMenuForQuota: {
        create: (update: MenuItemConstructorOptionsForQuota) => void;
        setTargetItem: (setPageServerQuotaTarget: (update: PageServerQuotaTargetItem) => void) => void;
      };

      order: {
        byIterater: (setQueueIterater: (update: string) => void) => void;
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
