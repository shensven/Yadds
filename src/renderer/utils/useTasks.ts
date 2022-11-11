import { startTransition } from 'react';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '@/renderer/atoms/atomConnectedUsers';
import { atomTasks, atomFetchStatus } from '@/renderer/atoms/atomTask';

const useTasks = () => {
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setTasks] = useAtom(atomTasks);
  const [, setFetchStatus] = useAtom(atomFetchStatus);

  const resetTasks = () => {
    setTasks([]);
  };

  const pollTasks = async () => {
    const targetUser = find(connectedUsers, { did: targetDid });

    if (!targetUser) {
      resetTasks();
      return;
    }

    try {
      const resp = await window.electron.net.poll({
        host: targetUser.host,
        port: targetUser.port,
        sid: targetUser.sid,
      });

      // console.log('pollTasks', resp);

      if (!resp.success) {
        setFetchStatus('pending');
        resetTasks();
      } else {
        setFetchStatus('polling');
        startTransition(() => setTasks(resp.data.task));
      }
    } catch (error) {
      setFetchStatus('pending');
      resetTasks();
      console.log(error);
    }
  };

  return { pollTasks, resetTasks };
};

export default useTasks;
