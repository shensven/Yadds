import { useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Stack, StyledEngineProvider, ThemeProvider, useMediaQuery } from '@mui/material';
import { MenuItemConstructorOptions } from 'electron';
import { YaddsCtx, YaddsProvider } from './context/YaddsContext';
import yaddsTheme from './theme/yaddsTheme';
import YaddsDrawer from './containers/YaddsDrawer';
import YaddsMain from './containers/YaddsMain';
import './App.scss';

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => unknown;
        set: (key: string, val: unknown) => void;
      };

      toggleNativeTheme: (themeSource: 'system' | 'light' | 'dark') => void;

      listenPrefersColorScheme: () => void;

      getOS: () => string;

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
    <ThemeProvider theme={yaddsTheme(toogleMUITheme())}>
      <StyledEngineProvider injectFirst>
        <MemoryRouter>
          <Stack direction="row">
            <YaddsDrawer />
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
