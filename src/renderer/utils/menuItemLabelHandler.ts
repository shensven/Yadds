import { TFunction } from 'react-i18next';

const menuItemLabelHandler = (
  t: TFunction<'translation', undefined>,
  hasYaddsSidebar: boolean,
  hasYaddsSidebarMarginTop: boolean
) => {
  const menuItemLabel = {
    aboutYadds: t('application_menu.darwin.about_yadds'),
    checkForUpdates: t('application_menu.darwin.check_for_updates'),
    preferences: t('application_menu.darwin.preferences'),
    services: t('application_menu.darwin.services'),
    hideYadds: t('application_menu.darwin.hide_yadds'),
    hideOthers: t('application_menu.darwin.hide_others'),
    quitYadds: t('application_menu.darwin.quit_yadds'),
    edit: t('application_menu.darwin.edit'),
    undo: t('application_menu.darwin.undo'),
    redo: t('application_menu.darwin.redo'),
    cut: t('application_menu.darwin.cut'),
    copy: t('application_menu.darwin.copy'),
    paste: t('application_menu.darwin.paste'),
    selectAll: t('application_menu.darwin.select_all'),
    view: t('application_menu.darwin.view'),
    showHideSidebar: hasYaddsSidebar
      ? t('application_menu.darwin.hide_sidebar')
      : t('application_menu.darwin.show_sidebar'),
    toggleFullScreen: hasYaddsSidebarMarginTop
      ? t('application_menu.darwin.enter_full_screen')
      : t('application_menu.darwin.exit_full_screen'),
    navigate: t('application_menu.darwin.navigate'),
    all: t('application_menu.darwin.all'),
    downloading: t('application_menu.darwin.downloading'),
    completed: t('application_menu.darwin.completed'),
    active: t('application_menu.darwin.active'),
    inactive: t('application_menu.darwin.inactive'),
    stopped: t('application_menu.darwin.stopped'),
    window: t('application_menu.darwin.window'),
    minimize: t('application_menu.darwin.minimize'),
    zoom: t('application_menu.darwin.zoom'),
    help: t('application_menu.darwin.help'),
    openYaddsWebsite: t('application_menu.darwin.open_yadds_website'),
    openYaddsRepository: t('application_menu.darwin.open_yadds_repository'),
    reportABug: t('application_menu.darwin.report_a_bug'),
  };

  return menuItemLabel;
};

export default menuItemLabelHandler;
