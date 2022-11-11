import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { atomPersistenceQueueIsAscend, atomPersistenceQueueIterater } from '@/renderer/atoms/atomUI';

const useMenuForQueue = () => {
  const { t } = useTranslation();

  const [queueIterater] = useAtom(atomPersistenceQueueIterater);
  const [queueIsAscend] = useAtom(atomPersistenceQueueIsAscend);

  const menuItems = {
    resumeAll: t('main.resume_all'),
    pauseAll: t('main.pause_all'),
    deleteAll: t('main.delete_all'),
    listView: t('main.list_view'),
    matrixView: t('main.matrix_view'),
    sortBy: t('main.sort_by'),
    queueIterater,
    date: t('main.date'),
    title: t('main.title'),
    downloadProgress: t('main.download_progress'),
    downloadSpeed: t('main.download_speed'),
    queueIsAscend,
    ascending: t('main.ascending'),
    descending: t('main.descending'),
  };

  return { menuItems };
};

export default useMenuForQueue;

export type MenuItemsInQueue = ReturnType<typeof useMenuForQueue>['menuItems'];
