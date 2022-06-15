import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { atomTasksRetryMax } from './atoms/atomConstant';
import { atomPersistenceTargetDid } from './atoms/atomConnectedUsers';
import { atomTasksStatus } from './atoms/atomTask';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import useTheme from './utils/useTheme';
import useNasInfo from './utils/useNasInfo';
import useQuota from './utils/useQuota';
import useTasks from './utils/useTasks';
import './i18n/i18n';
import './App.scss';

const App: React.FC = () => {
  const { theme } = useTheme();

  const [TASKS_RETRY_MAX] = useAtom(atomTasksRetryMax);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [tasksStatus] = useAtom(atomTasksStatus);

  const { getNasInfo, resetNasInfo } = useNasInfo();
  const { getQuota, resetQuota } = useQuota();
  const { handleTasks, stopTasks } = useTasks();

  useEffect(() => {
    if (targetDid.length === 0) {
      stopTasks();
      resetNasInfo();
      resetQuota();
      return () => {};
    }

    getNasInfo();
    getQuota();

    const timer = setInterval(() => {
      // console.log('renderer: retry', tasksStatus.retry);

      if (tasksStatus.retry < TASKS_RETRY_MAX) {
        handleTasks();
      } else {
        console.log('renderer: interval done');
        clearInterval(timer);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [targetDid, tasksStatus.retry]);

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
