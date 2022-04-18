import { TFunction } from 'react-i18next';

const menuItemHandler = (t: TFunction<'translation', undefined>, yaddsMainSortBy: string) => {
  const menuItem = {
    resumeAll: t('main.resume_all'),
    pauseAll: t('main.pause_all'),
    deleteAll: t('main.delete_all'),
    listView: t('main.list_view'),
    matrixView: t('main.matrix_view'),
    sortBy: t('main.sort_by'),
    yaddsMainSortBy,
    date: t('main.date'),
    downloadProgress: t('main.download_progress'),
    downloadSpeed: t('main.download_speed'),
    name: t('main.name'),
    ascending: t('main.ascending'),
    descending: t('main.descending'),
  };

  return menuItem;
};

export default menuItemHandler;
