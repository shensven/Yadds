import { MenuItemConstructorOptions } from 'electron';
import { useContext, useLayoutEffect } from 'react';
import { MemoryRouter, NavigateFunction } from 'react-router-dom';
import { TFunction, useTranslation } from 'react-i18next';
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

      setApplicationMenu: (t: TFunction) => void;
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

      getOS: () => 'darwin' | 'win32';

      getAppVersion: () => string;

      popupContextMenu: (val: MenuItemConstructorOptions[]) => void;

      openViaBrowser: (val: string) => void;

      net: {
        auth: (quickConnectID: string, account: string, passwd: string) => void;
      };
    };
  }
}

const DesignSystem: React.FC = () => {
  const { yaddsAppearance } = useContext(YaddsCtx);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { t } = useTranslation();

  useLayoutEffect(() => {
    window.electron?.setApplicationMenu(t); // Init system's menu
    window.electron?.setTray(t); // Init system's tary
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
