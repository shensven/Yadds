import { TFunction } from 'react-i18next';

const createMenuItemLabelsForTray = (t: TFunction<'translation', undefined>) => {
  const menuItem = {
    showMainWindow: t('tray.show_main_window'),
    quit: t('tray.quit'),
  };

  return menuItem;
};

export default createMenuItemLabelsForTray;

export type MenuItemLabelsForTray = ReturnType<typeof createMenuItemLabelsForTray>;
