import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CssBaseline, Stack, ThemeProvider } from '@mui/material';
import { Panes, Sidebar } from './layouts';
import useColorSystem from './utils/useColorSystem';
import useSchedule from './utils/useSchedule';
import './i18n/i18n';
import './App.scss';

const Route: React.FC = () => {
  const { colorSystem } = useColorSystem();
  useSchedule();

  return (
    <ThemeProvider theme={colorSystem}>
      <CssBaseline />
      <Stack direction="row">
        <Sidebar />
        <Panes />
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
