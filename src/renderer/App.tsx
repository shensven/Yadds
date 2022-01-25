import { MenuItemConstructorOptions } from 'electron';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Stack, ThemeProvider } from '@mui/material';
import { YaddsProvider } from './src/context/YaddsContext';
import yaddsTheme from './src/theme/yaddsTheme';
import YaddsDrawer from './src/containers/YaddsDrawer';
import QueueAll from './src/pages/QueueAll';
import QueueDownloading from './src/pages/QueueDownloading';
import QueueFinished from './src/pages/QueueFinished';
import QueueActive from './src/pages/QueueActive';
import QueueInactive from './src/pages/QueueInactive';
import QueueStopped from './src/pages/QueueStopped';
import Settings from './src/pages/Settings';
import './App.scss';

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => unknown;
        set: (key: string, val: unknown) => void;
      };
      appVersion: {
        get: () => string;
      };
      contextMenu: {
        popup: (val: MenuItemConstructorOptions[]) => void;
      };
      userBrowser: {
        openUrl: (val: string) => void;
      };
      net: {
        auth: (quickConnectID: string) => void;
      };
    };
  }
}

const RedirectEl: React.FC = () => {
  const category = window.electron?.store.get('yaddsDrawerCategory') as string;
  switch (category) {
    case '/queueAll':
      return <QueueAll />;
    case '/queueDownloading':
      return <QueueDownloading />;
    case '/queueFinished':
      return <QueueFinished />;
    case '/queueActive':
      return <QueueActive />;
    case '/queueInactive':
      return <QueueInactive />;
    case '/queueStopped':
      return <QueueStopped />;
    case '/settings':
      return <Settings />;
    default:
      return <QueueAll />;
  }
};

const App: React.FC = () => {
  return (
    <Stack direction="row">
      <Router>
        <YaddsDrawer />
        <Routes>
          <Route path="/" element={<RedirectEl />} />
          <Route path="/queueAll" element={<QueueAll />} />
          <Route path="/queueDownloading" element={<QueueDownloading />} />
          <Route path="/queueFinished" element={<QueueFinished />} />
          <Route path="/queueActive" element={<QueueActive />} />
          <Route path="/queueInactive" element={<QueueInactive />} />
          <Route path="/queueStopped" element={<QueueStopped />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </Stack>
  );
};

export default () => {
  return (
    <YaddsProvider>
      <ThemeProvider theme={yaddsTheme}>
        <App />
      </ThemeProvider>
    </YaddsProvider>
  );
};
