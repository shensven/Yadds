import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import { YaddsProvider } from './src/context/YaddsContext';
import yaddsTheme from './src/theme/yaddsTheme';
import YaddsDrawer from './src/components/YaddsDrawer';
import QueueAll from './src/pages/QueueAll';
import QueueDownloading from './src/pages/QueueDownloading';
import QueueFinished from './src/pages/QueueFinished';
import QueueActive from './src/pages/QueueActive';
import QueueInactive from './src/pages/QueueInactive';
import QueueStopped from './src/pages/QueueStopped';
import Settings from './src/pages/Settings';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
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
    </Box>
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
