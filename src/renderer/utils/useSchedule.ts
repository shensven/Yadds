import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { atomTasksRetryMax } from '../atoms/atomConstant';
import {
  atomHasSidebarMarginTop,
  atomPersistenceAppearance,
  atomPersistenceHasSidebar,
  atomPersistenceLocaleName,
} from '../atoms/atomUI';
import { atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomTasksStatus } from '../atoms/atomTask';
import useNasInfo from './useNasInfo';
import useQuota from './useQuota';
import useTasks from './useTasks';
import useMenuForApp from './useMenuForApp';
import useMenuForTray from './useMenuForTray';

const useSchedule = () => {
  const [hasSidebar, setHasSidebar] = useAtom(atomPersistenceHasSidebar);
  const [hasSidebarMarginTop, setHasSidebarMarginTop] = useAtom(atomHasSidebarMarginTop);

  const [appearance] = useAtom(atomPersistenceAppearance);
  const [localeName] = useAtom(atomPersistenceLocaleName);

  const [TASKS_RETRY_MAX] = useAtom(atomTasksRetryMax);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [tasksStatus] = useAtom(atomTasksStatus);

  const { getNasInfo, resetNasInfo } = useNasInfo();
  const { getQuota, resetQuota } = useQuota();
  const { pollTasks, stopTasks } = useTasks();

  const { menuItems: menuItemsInApp } = useMenuForApp();
  const { menuItems: menuItemsInTray } = useMenuForTray();

  useEffect(() => {
    window.electron?.yadds.toogleSidebar(hasSidebar, setHasSidebar);
    window.electron?.topMenuForApp.create(menuItemsInApp);
  }, [hasSidebar]);

  useEffect(() => {
    window.electron?.yadds.toogleSidebarMarginTop(setHasSidebarMarginTop);
    window.electron?.topMenuForApp.create(menuItemsInApp);
  }, [hasSidebarMarginTop]);

  useEffect(() => {
    window.electron?.app.toggleNativeTheme(appearance);
  }, [appearance]);

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
        pollTasks();
      } else {
        console.log('renderer: interval done');
        clearInterval(timer);
      }
    }, 2000);

    return () => clearInterval(timer);
  }, [targetDid, tasksStatus.retry]);

  useEffect(() => {
    window.electron?.topMenuForApp.create(menuItemsInApp);
    window.electron?.contextMenuForTray.create(menuItemsInTray);
  }, [localeName]);
};

export default useSchedule;
