import { MenuItemConstructorOptions } from 'electron';
import { MemoryRouter as Router } from 'react-router-dom';
import { Stack, StyledEngineProvider, ThemeProvider } from '@mui/material';
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
          <Router>
            <Stack direction="row">
              <YaddsDrawer />
              <YaddsMain />
            </Stack>
          </Router>
        </StyledEngineProvider>
      </ThemeProvider>
    </YaddsProvider>
  );
};

export default App;
