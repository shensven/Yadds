import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { atomTasksRetryMax } from './atoms/atomConstant';
import { atomNasInfo, atomPersistenceAppearance, atomQuotaList, atomTargeByteSizeForQuota } from './atoms/atomUI';
import { atomPersistenceTargetDid } from './atoms/atomConnectedUsers';
import { atomTasks, atomTasksStatus } from './atoms/atomTask';
import initMUITheme from './theme/yaddsMUITheme';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import useNasInfo from './utils/useNasInfo';
import useQuota from './utils/useQuota';
import useTasks from './utils/useTasks';
import './i18n/i18n';
import './App.scss';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [TASKS_RETRY_MAX] = useAtom(atomTasksRetryMax);
  const [appearance] = useAtom(atomPersistenceAppearance);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setTasks] = useAtom(atomTasks);
  const [tasksStatus, setTasksStatus] = useAtom(atomTasksStatus);
  const [, setNasInfo] = useAtom(atomNasInfo);
  const [, setQuotaList] = useAtom(atomQuotaList);
  const [, setTargeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);

  const getNasInfo = useNasInfo();
  const getQuota = useQuota();
  const handleTasks = useTasks();

  useEffect(() => {
    if (targetDid.length === 0) {
      setTasksStatus({ isLoading: false, retry: 3 });
      setTasks([]);
      setNasInfo({ model: '-', version: '-' });
      setQuotaList([]);
      setTargeByteSizeForQuota({
        max: { value: '-', unit: '', long: '', toString: () => '' },
        available: { value: '-', unit: '', long: '', toString: () => '' },
      });
      return undefined;
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

  const toogleMUITheme = (): 'light' | 'dark' => {
    if (appearance === 'system') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return appearance;
  };

  return (
    <ThemeProvider theme={initMUITheme(toogleMUITheme())}>
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
