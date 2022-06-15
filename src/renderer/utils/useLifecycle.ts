import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { atomTasksRetryMax } from '../atoms/atomConstant';
import { atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomTasksStatus } from '../atoms/atomTask';
import useNasInfo from './useNasInfo';
import useQuota from './useQuota';
import useTasks from './useTasks';

const useLifecycle = () => {
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
};

export default useLifecycle;
