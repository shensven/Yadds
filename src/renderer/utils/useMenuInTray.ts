import { useTranslation } from 'react-i18next';

const useMenuInTray = () => {
  const { t } = useTranslation();

  const menuItems = {
    showMainWindow: t('tray.show_main_window'),
    quit: t('tray.quit'),
  };

  return { menuItems };
};

export default useMenuInTray;

export type MenuItemsInTray = ReturnType<typeof useMenuInTray>['menuItems'];
