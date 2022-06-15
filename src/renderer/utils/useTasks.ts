import { startTransition } from 'react';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import { atomTasksRetryMax } from '../atoms/atomConstant';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomTasks, atomTasksStatus } from '../atoms/atomTask';

const useTasks = () => {
  const [TASKS_RETRY_MAX] = useAtom(atomTasksRetryMax);
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setTasks] = useAtom(atomTasks);
  const [tasksStatus, setTasksStatus] = useAtom(atomTasksStatus);

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
        console.log('renderer: good tasks request', resp.data.task);
        setTasksStatus({ isLoading: false, retry: 0 });
        startTransition(() => setTasks(resp.data.task));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return handleTasks;
};

export default useTasks;
