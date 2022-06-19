import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import useDesignSystem from './utils/useDesignSystem';
import useSchedule from './utils/useSchedule';
import './i18n/i18n';
import './App.scss';

const App: React.FC = () => {
  const { designSystem } = useDesignSystem();
  useSchedule();

  return (
    <ThemeProvider theme={designSystem}>
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
