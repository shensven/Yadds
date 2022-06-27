import { useEffect, useLayoutEffect } from 'react';
import { usePrevious, useUpdateEffect } from 'ahooks';
import { useAtom } from 'jotai';
import {
  atomHasSidebarMarginTop,
  atomPersistenceAppearance,
  atomPersistenceHasSidebar,
  atomPersistenceLocaleName,
  atomPersistenceQueueIsAscend,
  atomPersistenceQueueIterater,
} from '../atoms/atomUI';
import { atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomFetchStatus } from '../atoms/atomTask';
import useNav from './useNav';
import useNasInfo from './useNasInfo';
import useQuota from './useQuota';
import useVolume from './useVolume';
import useTasks from './useTasks';
import useMenuForApp from './useMenuForApp';
import useMenuForTray from './useMenuForTray';

const useSchedule = () => {
  const [hasSidebar, setHasSidebar] = useAtom(atomPersistenceHasSidebar);
  const [hasSidebarMarginTop, setHasSidebarMarginTop] = useAtom(atomHasSidebarMarginTop);

  const [, setQueueIterater] = useAtom(atomPersistenceQueueIterater);
  const [, setQueueIsAscend] = useAtom(atomPersistenceQueueIsAscend);

  const [appearance] = useAtom(atomPersistenceAppearance);
  const [localeName] = useAtom(atomPersistenceLocaleName);

  const [fetchStatus, setFetchStatus] = useAtom(atomFetchStatus);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const prevTargetDid = usePrevious(targetDid);

  const { menuItems: menuItemsInApp } = useMenuForApp();
  const { menuItems: menuItemsInTray } = useMenuForTray();

  const { navigate } = useNav();

  const { getNasInfo, resetNasInfo } = useNasInfo();
  const { getQuota, resetQuota, resetTargetMenuItem: resetTargetMenuItemForQuota } = useQuota();
  const { getVolume } = useVolume();

  const { pollTasks, resetTasks } = useTasks();

  // create top menu and tray
  useLayoutEffect(() => {
    window.electron?.topMenuForApp.create(menuItemsInApp);
    window.electron?.contextMenuForTray.create(menuItemsInTray);
  }, []);

  // let the main process to control some state of the rederer process by closures
  useLayoutEffect(() => {
    window.electron?.yadds.toogleSidebarMarginTop(setHasSidebarMarginTop);
    window.electron?.yadds.navigate(navigate);
    window.electron?.queue.orderBy(setQueueIterater);
    window.electron?.queue.isAscend(setQueueIsAscend);
  }, []);

  useUpdateEffect(() => {
    window.electron?.yadds.toogleSidebar(hasSidebar, setHasSidebar);
    window.electron?.topMenuForApp.create(menuItemsInApp);
  }, [hasSidebar]);

  useUpdateEffect(() => {
    window.electron?.yadds.toogleSidebarMarginTop(setHasSidebarMarginTop);
    window.electron?.topMenuForApp.create(menuItemsInApp);
  }, [hasSidebarMarginTop]);

  useUpdateEffect(() => {
    window.electron?.app.toggleNativeTheme(appearance);
  }, [appearance]);

  useUpdateEffect(() => {
    window.electron?.topMenuForApp.create(menuItemsInApp);
    window.electron?.contextMenuForTray.create(menuItemsInTray);
  }, [localeName]);

  useUpdateEffect(() => {
    if (fetchStatus === 'switching') {
      resetTasks();
      resetQuota();
      resetTargetMenuItemForQuota();
      resetNasInfo();
      getNasInfo();
      console.log('switching');
      return undefined;
    }

    if (fetchStatus === 'pending') {
      const timer = setInterval(() => {
        getNasInfo();
        console.log('pending');
      }, 5000);
      return () => clearInterval(timer);
    }

    if (fetchStatus === 'polling') {
      getNasInfo();
      getVolume();
      const timer = setInterval(() => {
        getQuota();
        pollTasks();
        console.log('polling');
      }, 3000);
      return () => clearInterval(timer);
    }

    if (fetchStatus === 'stopped') {
      resetTasks();
      resetQuota();
      resetTargetMenuItemForQuota();
      resetNasInfo();
      console.log('stopped');
      return undefined;
    }

    return undefined;
  }, [fetchStatus]);

  useEffect(() => {
    if (targetDid.length === 0) {
      setFetchStatus('stopped');
    } else if (prevTargetDid && prevTargetDid !== targetDid) {
      setFetchStatus('switching');
    } else {
      setFetchStatus('polling');
    }
  }, [targetDid]);
};

export default useSchedule;
