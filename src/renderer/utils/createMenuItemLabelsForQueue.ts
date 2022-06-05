import { TFunction } from 'react-i18next';

const createMenuItemLabelsForQueue = (
  t: TFunction<'translation', undefined>,
  queueIterater: string,
  queueIsAscend: boolean
) => {
  const menuItem = {
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

  return menuItem;
};

export default createMenuItemLabelsForQueue;

export type MenuItemLabelsForQueue = ReturnType<typeof createMenuItemLabelsForQueue>;
