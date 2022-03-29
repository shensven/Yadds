import { MenuItemConstructorOptions } from 'electron';
import { useContext } from 'react';
import { MemoryRouter, NavigateFunction } from 'react-router-dom';
import { TFunction } from 'react-i18next';
import { CssBaseline, Stack, StyledEngineProvider, ThemeProvider, useMediaQuery } from '@mui/material';
import { YaddsCtx, YaddsProvider } from './context/YaddsContext';
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
        auth: (
          quickConnectID: string,
          account: string,
          passwd: string
        ) => Promise<
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
      };
    };
  }
}

const DesignSystem: React.FC = () => {
  const { yaddsAppearance } = useContext(YaddsCtx);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

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
