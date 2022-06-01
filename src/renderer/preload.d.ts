import { TFunction } from 'react-i18next';
import { NavigateFunction } from 'react-router-dom';
import { Channels } from 'main/preload';
import { ServerError } from 'main/net/getServerInfo';
import { SignInInfo, SignInWrongAccountOrPasswd } from 'main/net/signIn';
import { YaddsAppearance, YaddsCategoryPath } from './atoms/yaddsAtoms';
import { AppMenuItem } from './utils/appMenuItemHandler';
import { ContextMenuItem } from './utils/contextMenuItemHandler';
import { TasksError, TasksInfo } from '../main/net/poll';
import { DsmInfo } from '../main/net/getDsmInfo';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      toggleNativeTheme: (update: YaddsAppearance) => void;

      setAppMenu: (update: AppMenuItem) => void;

      setTray: (t: TFunction) => void;

      setContextMenu: (update: ContextMenuItem) => void;

      order: {
        byIterater: (persistOrderIterater: (update: string) => void) => void;
        isAscend: (persistOrderIsAscend: (updaet: boolean) => void) => void;
      };

      zoomWindow: () => void;

      toogleSidebar: (hasYaddsSidebar: boolean, persistHasYaddsSidebar: (hasYaddsSidebar: boolean) => void) => void;

      toogleSidebarMarginTop: (setHasYaddsSidebarMarginTop: (update: boolean) => void) => void;

      navigateTo: (
        navigateViaReact: NavigateFunction,
        persistYaddsSidebarCategory: (update: YaddsCategoryPath) => void
      ) => void;

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

        getQuata: (props: { host: string; port: number; sid: string }) => Promise<void>;
      };
    };
  }
}

export {};
