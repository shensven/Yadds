import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import useDesignSystem from './utils/useDesignSystem';
import useSchedule from './utils/useSchedule';
import './i18n/i18n';
import './App.scss';

const Route: React.FC = () => {
  const { designSystem } = useDesignSystem();
  useSchedule();

  return (
    <ThemeProvider theme={designSystem}>
      <CssBaseline />
      <Stack direction="row">
        <YaddsSidebar />
        <YaddsMain />
      </Stack>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Route />
    </MemoryRouter>
  );
};

export default App;
