import { MenuItemConstructorOptions } from 'electron';
import { useContext, useLayoutEffect } from 'react';
import { MemoryRouter, NavigateFunction } from 'react-router-dom';
import { TFunction } from 'react-i18next';
import { CssBaseline, Stack, StyledEngineProvider, ThemeProvider, useMediaQuery } from '@mui/material';
import { CtxType, DSTasks, YaddsCtx, YaddsProvider } from './context/YaddsContext';
import TASKS_RETRY from './context/tasksRetry';
import initMUITheme from './theme/yaddsMUITheme';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import './i18n/i18n';
import './App.scss';

declare global {
  interface Window {
    electron: {
      toggleNativeTheme: (themeSource: 'system' | 'light' | 'dark') => void;
      setApplicationMenu: (menuItemLabelHandler: any) => void;
      setTray: (t: TFunction) => void;
      zoomWindow: () => void;
      toogleSidebar: (hasYaddsSidebar: boolean, persistHasYaddsSidebar: (hasYaddsSidebar: boolean) => void) => void;
      toogleSidebarMarginTop: (
        hasYaddsSidebarMarginTop: boolean,
        setHasYaddsSidebarMarginTop: (hasYaddsSidebarMarginTop: boolean) => void
      ) => void;
      navigateTo: (
        navigateViaReact: NavigateFunction,
        persistYaddsSidebarCategory: (YaddsSidebarCategory: string) => void
      ) => void;
      store: {
        get: (key: string) => unknown;
        set: (key: string, val: unknown) => void;
      };
      getOS: () => 'darwin' | 'win32' | 'linux';
      getAppVersion: () => string;
      popupContextMenu: (val: MenuItemConstructorOptions[]) => void;
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
      };
    };
  }
}

const DesignSystem: React.FC = () => {
  const { yaddsAppearance, dsmConnectList, dsmConnectIndex, setTasks, tasksStatus, setTasksStatus } =
    useContext<CtxType>(YaddsCtx);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const handleTasks = async () => {
    const resp = await window.electron?.net.poll({
      host: dsmConnectList[dsmConnectIndex]?.host,
      port: dsmConnectList[dsmConnectIndex]?.port,
      sid: dsmConnectList[dsmConnectIndex]?.sid,
    });

    console.log('tasksStatus.retry', tasksStatus.retry);

    if (!resp.success && tasksStatus.retry < TASKS_RETRY) {
      console.log('bad tasks request');

      setTasksStatus((old) => {
        if (old.retry >= TASKS_RETRY) {
          return { ...old, isLoading: false };
        }
        return { isLoading: true, retry: old.retry + 1 };
      });
    }

    if (resp.success) {
      console.log('good tasks request');
      setTasksStatus({ isLoading: false, retry: 0 });
      setTasks(resp.data.tasks);
    }
  };

  useLayoutEffect(() => {
    if (!dsmConnectList[dsmConnectIndex]) {
      setTasks([]);
      return undefined;
    }

    const timer = setInterval(() => {
      console.log('retry', tasksStatus.retry);

      if (tasksStatus.retry < TASKS_RETRY) {
        handleTasks();
      } else {
        console.log('request done');
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
      <StyledEngineProvider injectFirst>
        <MemoryRouter>
          <Stack direction="row">
            <YaddsSidebar />
            <YaddsMain />
          </Stack>
        </MemoryRouter>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <YaddsProvider>
      <DesignSystem />
    </YaddsProvider>
  );
};

export default App;
