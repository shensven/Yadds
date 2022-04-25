import { startTransition, useEffect } from 'react';
import { MemoryRouter, NavigateFunction } from 'react-router-dom';
import { TFunction } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import {
  dsmConnectIndexAtomWithPersistence,
  dsmConnectListAtomWithPersistence,
  dsmInfoAtom,
  DSTasks,
  tasksAtom,
  tasksRetry,
  tasksStatusAtom,
  yaddsAppearanceAtomWithPersistence,
} from './atoms/yaddsAtoms';
import initMUITheme from './theme/yaddsMUITheme';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import './i18n/i18n';
import './App.scss';

declare global {
  interface Window {
    electron: {
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
      toogleSidebarMarginTop: (
        hasYaddsSidebarMarginTop: boolean,
        setHasYaddsSidebarMarginTop: (hasYaddsSidebarMarginTop: boolean) => void
      ) => void;
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
        auth: (props: { quickConnectID: string; account: string; passwd: string }) => Promise<
          | {
              data: { did: string; sid: string };
              hostname: string;
              port: number;
              success: true;
            }
          | {
              msg: string;
              errCode: '01' | '02' | '024' | '03' | '04';
              success: false;
            }
        >;

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

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [TASKS_RETRY] = useAtom(tasksRetry);
  const [yaddsAppearance] = useAtom(yaddsAppearanceAtomWithPersistence);
  const [dsmConnectList] = useAtom(dsmConnectListAtomWithPersistence);
  const [dsmConnectIndex] = useAtom(dsmConnectIndexAtomWithPersistence);
  const [, setTasks] = useAtom(tasksAtom);
  const [tasksStatus, setTasksStatus] = useAtom(tasksStatusAtom);
  const [, setDsmInfo] = useAtom(dsmInfoAtom);

  const handleTasks = async () => {
    const resp = await window.electron?.net.poll({
      host: dsmConnectList[dsmConnectIndex]?.host,
      port: dsmConnectList[dsmConnectIndex]?.port,
      sid: dsmConnectList[dsmConnectIndex]?.sid,
    });

    if (!resp.success && tasksStatus.retry < TASKS_RETRY) {
      console.log('renderer: bad tasks request');

      setTasksStatus((old) => {
        if (old.retry >= TASKS_RETRY) {
          return { ...old, isLoading: false };
        }
        return { isLoading: true, retry: old.retry + 1 };
      });
    }

    if (resp.success) {
      console.log('renderer: good tasks request');
      setTasksStatus({ isLoading: false, retry: 0 });
      startTransition(() => setTasks(resp.data.tasks));
    }
  };

  const getDsmInfo = async () => {
    const resp = await window.electron.net.getDsmInfo({
      host: dsmConnectList[dsmConnectIndex]?.host,
      port: dsmConnectList[dsmConnectIndex]?.port,
      sid: dsmConnectList[dsmConnectIndex]?.sid,
    });

    if (!resp.success) {
      setDsmInfo({
        model: '-',
        version: '-',
      });
    }

    if (resp.success) {
      const version = resp.data?.version_string.split(' ')[1] as string;
      setDsmInfo({
        model: resp.data?.model as string,
        version,
      });
    }
  };

  useEffect(() => {
    if (!dsmConnectList[dsmConnectIndex]) {
      console.log('renderer: undefined dsmConnectList[dsmConnectIndex]');
      setTasksStatus({ isLoading: false, retry: 3 });
      setTasks([]);
      return undefined;
    }

    getDsmInfo();

    const timer = setInterval(() => {
      console.log('renderer: retry', tasksStatus.retry);

      if (tasksStatus.retry < TASKS_RETRY) {
        handleTasks();
      } else {
        console.log('renderer: interval done');
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [dsmConnectList[dsmConnectIndex], tasksStatus.retry]);

  const toogleMUITheme = (): 'light' | 'dark' => {
    switch (yaddsAppearance) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
        return prefersDarkMode ? 'dark' : 'light';
      default:
        return 'light';
    }
  };

  return (
    <ThemeProvider theme={initMUITheme(toogleMUITheme())}>
      <CssBaseline />
      <MemoryRouter>
        <Stack direction="row">
          <YaddsSidebar />
          <YaddsMain />
        </Stack>
      </MemoryRouter>
    </ThemeProvider>
  );
};

export default App;
