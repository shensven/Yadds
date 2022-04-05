import { MenuItemConstructorOptions } from 'electron';
import { useContext, useLayoutEffect } from 'react';
import { MemoryRouter, NavigateFunction } from 'react-router-dom';
import { TFunction } from 'react-i18next';
import { CssBaseline, Stack, StyledEngineProvider, ThemeProvider, useMediaQuery } from '@mui/material';
import { DSTasks, YaddsCtx, YaddsProvider } from './context/YaddsContext';
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
  const { yaddsAppearance, dsmConnectList, dsmConnectIndex, setTasks } = useContext(YaddsCtx);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const handleTasks = async () => {
    const resp = await window.electron?.net.poll({
      host: dsmConnectList[dsmConnectIndex]?.host,
      port: dsmConnectList[dsmConnectIndex]?.port,
      sid: dsmConnectList[dsmConnectIndex]?.sid,
    });
    if (resp.success) {
      console.log(resp);
      setTasks(resp.data.tasks);
    }
  };

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      handleTasks();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
