import { MenuItemConstructorOptions } from 'electron';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
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
      contextMenu: {
        popup: (val: MenuItemConstructorOptions[]) => void;
      };
    };
  }
}

const App: React.FC = () => {
  return (
    <Stack direction="row">
      <Router>
        <YaddsDrawer />
        <Switch>
          <Route exact path="/" component={QueueAll} />
          <Route path="/queueAll" component={QueueAll} />
          <Route path="/queueDownloading" component={QueueDownloading} />
          <Route path="/queueFinished" component={QueueFinished} />
          <Route path="/queueActive" component={QueueActive} />
          <Route path="/queueInactive" component={QueueInactive} />
          <Route path="/queueStopped" component={QueueStopped} />
          <Route path="/settings" component={Settings} />
        </Switch>
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
