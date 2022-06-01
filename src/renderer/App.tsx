import React, { startTransition, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import {
  dsmConnectListAtomWithPersistence,
  dsmCurrentSidAtomWithPersistence,
  dsmInfoAtom,
  tasksAtom,
  tasksRetry,
  tasksStatusAtom,
  yaddsAppearanceAtomWithPersistence,
} from './atoms/yaddsAtoms';
import initMUITheme from './theme/yaddsMUITheme';
import YaddsSidebar from './containers/YaddsSidebar';
import YaddsMain from './containers/YaddsMain';
import './i18n/i18n';
import './App.scss';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [TASKS_RETRY] = useAtom(tasksRetry);
  const [yaddsAppearance] = useAtom(yaddsAppearanceAtomWithPersistence);
  const [dsmConnectList] = useAtom(dsmConnectListAtomWithPersistence);
  const [dsmCurrentSid] = useAtom(dsmCurrentSidAtomWithPersistence);
  const [, setTasks] = useAtom(tasksAtom);
  const [tasksStatus, setTasksStatus] = useAtom(tasksStatusAtom);
  const [, setDsmInfo] = useAtom(dsmInfoAtom);

  const handleTasks = async () => {
    const currentUser = find(dsmConnectList, { sid: dsmCurrentSid });

    if (!currentUser) {
      return;
    }

    try {
      const resp = await window.electron.net.poll({
        host: currentUser.host,
        port: currentUser.port,
        sid: currentUser.sid,
      });

      if (!resp.success && tasksStatus.retry < TASKS_RETRY) {
        console.log('renderer: bad tasks request');

        setTasksStatus((old) => {
          if (old.retry >= TASKS_RETRY) {
            return { ...old, isLoading: false };
          }
          return { isLoading: true, retry: old.retry + 1 };
        });
      }

      if (resp.success) {
        console.log('renderer: good tasks request', resp.data.task);
        setTasksStatus({ isLoading: false, retry: 0 });
        startTransition(() => setTasks(resp.data.task));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDsmInfo = async () => {
    const currentUser = find(dsmConnectList, { sid: dsmCurrentSid });

    if (!currentUser) {
      return;
    }

    const resp = await window.electron.net.getDsmInfo({
      host: currentUser!.host,
      port: currentUser!.port,
      sid: currentUser!.sid,
    });

    if (!resp.success) {
      setDsmInfo({
        model: '-',
        version: '-',
      });
    }

    if (resp.success) {
      const version = resp.data?.version_string.split(' ')[1] as string;
      setDsmInfo({
        model: resp.data?.model as string,
        version,
      });
    }
  };

  useEffect(() => {
    if (dsmCurrentSid.length === 0) {
      setTasksStatus({ isLoading: false, retry: 3 });
      setTasks([]);
      return undefined;
    }

    getDsmInfo();

    const timer = setInterval(() => {
      console.log('renderer: retry', tasksStatus.retry);

      if (tasksStatus.retry < TASKS_RETRY) {
        handleTasks();
      } else {
        console.log('renderer: interval done');
        clearInterval(timer);
      }
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [dsmCurrentSid, tasksStatus.retry]);

  const toogleMUITheme = (): 'light' | 'dark' => {
    switch (yaddsAppearance) {
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
