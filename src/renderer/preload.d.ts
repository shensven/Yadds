import { TFunction } from 'react-i18next';
import { NavigateFunction } from 'react-router-dom';
import { Channels } from 'main/preload';
import { ServerError } from 'main/net/getServerInfo';
import { PingPongError } from 'main/net/pingPong';
import { SignInError, SignInInfo } from 'main/net/signIn';
import { DSTasks } from './atoms/yaddsAtoms';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      toggleNativeTheme: (themeSource: 'system' | 'light' | 'dark') => void;
      setApplicationMenu: (menuItemHandler: any) => void;
      setTray: (t: TFunction) => void;
      setContextMenu: (menuItemHandler: any) => void;
      order: {
        byIterater: (persistYaddsMainOrderIterater: (yaddsMainOrderIterater: string) => void) => void;
        isAscend: (persistYaddsMainOrderIsAscend: (yaddsMainOrderIsAscend: boolean) => void) => void;
      };
      zoomWindow: () => void;
      toogleSidebar: (hasYaddsSidebar: boolean, persistHasYaddsSidebar: (hasYaddsSidebar: boolean) => void) => void;
      toogleSidebarMarginTop: (setHasYaddsSidebarMarginTop: (hasYaddsSidebarMarginTop: boolean) => void) => void;
      navigateTo: (
        navigateViaReact: NavigateFunction,
        persistYaddsSidebarCategory: (
          YaddsSidebarCategory:
            | '/queueAll'
            | '/queueDownloading'
            | '/queueFinished'
            | '/queueActive'
            | '/queueInactive'
            | '/queueStopped'
            | '/server'
            | '/settings'
        ) => void
      ) => void;
      store: {
        get: (key: string) => unknown;
        set: (key: string, val: unknown) => void;
      };
      getOS: () => 'darwin' | 'win32' | 'linux';
      getAppVersion: () => string;
      openViaBrowser: (val: string) => void;
      net: {
        auth: (props: {
          quickConnectID: string;
          account: string;
          passwd: string;
        }) => Promise<ServerError | PingPongError | SignInError | SignInInfo>;

        poll: (props: { host: string; port: number; sid: string }) => Promise<{
          success: boolean;
          data: {
            tasks: DSTasks[];
            total?: number;
          };
        }>;

        getDsmInfo: (props: { host: string; port: number; sid: string }) => Promise<{
          success: boolean;
          data?: {
            codepage: string;
            model: string;
            ram: number;
            serial: string;
            temperature: number;
            temperature_warn: boolean;
            time: string;
            uptime: number;
            version: string;
            version_string: string;
          };
        }>;
      };
    };
  }
}

export {};
