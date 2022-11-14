import { t } from 'i18next';
import { useAtom } from 'jotai';
import IonShapesOutline from '@/renderer/assets/icons/IonShapesOutline';
import IonShapes from '@/renderer/assets/icons/IonShapes';
import IonArrowDownCircleOutline from '@/renderer/assets/icons/IonArrowDownCircleOutline';
import IonArrowDownCircle from '@/renderer/assets/icons/IonArrowDownCircle';
import IonCheckmarkCircleOutline from '@/renderer/assets/icons/IonCheckmarkCircleOutline';
import IonCheckmarkCircle from '@/renderer/assets/icons/IonCheckmarkCircle';
import IonArrowUpCircleOutline from '@/renderer/assets/icons/IonArrowUpCircleOutline';
import IonArrowUpCircle from '@/renderer/assets/icons/IonArrowUpCircle';
import IonCloseCircleOutline from '@/renderer/assets/icons/IonCloseCircleOutline';
import IonCloseCircle from '@/renderer/assets/icons/IonCloseCircle';
import IonStopCircleOutline from '@/renderer/assets/icons/IonStopCircleOutline';
import IonStopCircle from '@/renderer/assets/icons/IonStopCircle';
import { atomTasks } from '../atoms/atomTask';
import { Category } from './StyledListItemButton';

const useCategory = () => {
  const [tasks] = useAtom(atomTasks);

  const categorys: Category[] = [
    {
      path: '/queueAll',
      tasksLength: tasks.length,
      name: t('sidebar.all'),
      activeIcon: <IonShapes sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonShapesOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueDownloading',
      tasksLength: tasks.filter((task) => task.status === 2).length,
      name: t('sidebar.downloading'),
      activeIcon: <IonArrowDownCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonArrowDownCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueFinished',
      tasksLength: tasks.filter((task) => task.status === 'finished' || task.status === 5).length,
      name: t('sidebar.completed'),
      activeIcon: <IonCheckmarkCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonCheckmarkCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueActive',
      tasksLength: tasks.filter((task) => task.status === 2 || task.status === 8).length,
      name: t('sidebar.active'),
      activeIcon: <IonArrowUpCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonArrowUpCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueInactive',
      tasksLength: tasks.filter((task) => task.status === 3).length,
      name: t('sidebar.inactive'),
      activeIcon: <IonCloseCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonCloseCircleOutline sx={{ fontSize: 20 }} />,
    },
    {
      path: '/queueStopped',
      tasksLength: tasks.filter((task) => task.status === 3).length,
      name: t('sidebar.stopped'),
      activeIcon: <IonStopCircle sx={{ fontSize: 20 }} />,
      inactiveIcon: <IonStopCircleOutline sx={{ fontSize: 20 }} />,
    },
  ];

  return categorys;
};

export default useCategory;
