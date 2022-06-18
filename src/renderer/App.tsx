import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import useTheme from './utils/useTheme';
import useSchedule from './utils/useSchedule';
import './i18n/i18n';
import './App.scss';

const App: React.FC = () => {
  const { theme } = useTheme();

  useSchedule();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter>
        <Stack direction="row">
          <YaddsSidebar />
          <YaddsMain />
        </Stack>
      </MemoryRouter>
    </ThemeProvider>
  );
};

export default App;
