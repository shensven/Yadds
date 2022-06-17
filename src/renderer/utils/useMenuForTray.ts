import { useTranslation } from 'react-i18next';

const useMenuForTray = () => {
  const { t } = useTranslation();

  const menuItems = {
    showMainWindow: t('tray.show_main_window'),
    quit: t('tray.quit'),
  };

  return { menuItems };
};

export default useMenuForTray;

export type MenuItemsInTray = ReturnType<typeof useMenuForTray>['menuItems'];
