import React, { startTransition, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import { atomTasksRetryMax } from './atoms/atomConstant';
import {
  atomNasInfo,
  atomPersistenceAppearance,
  atomPersistenceTargeMenuItemForQuota,
  atomQuotaList,
  atomTargeByteSizeForQuota,
} from './atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from './atoms/atomConnectedUsers';
import { atomTasks, atomTasksStatus } from './atoms/atomTask';
import initMUITheme from './theme/yaddsMUITheme';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import getNasInfo from './utils/getNasInfo';
import getQuota from './utils/getQuota';
import './i18n/i18n';
import './App.scss';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [TASKS_RETRY_MAX] = useAtom(atomTasksRetryMax);
  const [appearance] = useAtom(atomPersistenceAppearance);
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setTasks] = useAtom(atomTasks);
  const [tasksStatus, setTasksStatus] = useAtom(atomTasksStatus);
  const [, setNasInfo] = useAtom(atomNasInfo);
  const [, setQuotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [, setTargeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);

  const handleTasks = async () => {
    const targetUser = find(connectedUsers, { did: targetDid });

    if (!targetUser) {
      return;
    }

    try {
      const resp = await window.electron.net.poll({
        host: targetUser.host,
        port: targetUser.port,
        sid: targetUser.sid,
      });

      if (!resp.success && tasksStatus.retry < TASKS_RETRY_MAX) {
        console.log('renderer: bad tasks request');

        setTasksStatus((old) => {
          if (old.retry >= TASKS_RETRY_MAX) {
            return { ...old, isLoading: false };
          }
          return { isLoading: true, retry: old.retry + 1 };
        });
      }

      if (resp.success) {
        // console.log('renderer: good tasks request', resp.data.task);
        setTasksStatus({ isLoading: false, retry: 0 });
        startTransition(() => setTasks(resp.data.task));
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    getNasInfo({ connectedUsers, targetDid, setNasInfo });
    getQuota({ connectedUsers, targetDid, targeMenuItemForQuota, setQuotaList, setTargeByteSizeForQuota });

    const timer = setInterval(() => {
      // console.log('renderer: retry', tasksStatus.retry);

      if (tasksStatus.retry < TASKS_RETRY_MAX) {
        handleTasks();
      } else {
        console.log('renderer: interval done');
        clearInterval(timer);
      }
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [targetDid, tasksStatus.retry]);

  const toogleMUITheme = (): 'light' | 'dark' => {
    switch (appearance) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
        return prefersDarkMode ? 'dark' : 'light';
      default:
        return 'light';
    }
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
