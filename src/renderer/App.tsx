import { MemoryRouter } from 'react-router-dom';
import { Stack, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { MenuItemConstructorOptions } from 'electron';
import { YaddsProvider } from './context/YaddsContext';
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

const App: React.FC = () => {
  return (
    <YaddsProvider>
      <ThemeProvider theme={yaddsTheme}>
        <StyledEngineProvider injectFirst>
          <MemoryRouter>
            <Stack direction="row">
              <YaddsDrawer />
              <YaddsMain />
            </Stack>
          </MemoryRouter>
        </StyledEngineProvider>
      </ThemeProvider>
    </YaddsProvider>
  );
};

export default App;
