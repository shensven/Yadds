import { MenuItemConstructorOptions } from 'electron';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { atomPersistenceTargeMenuItemForQuota, atomQuotaList } from '../atoms/atomUI';

const useMenuConstructorOptionsForQuota = () => {
  const { t } = useTranslation();

  const [quotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);

  const menuItemConstructorOptions: MenuItemConstructorOptions[] = [];

  const targetVolumeName = targeMenuItemForQuota.split(',')[0].split(':')[1];
  const targetShareName = targeMenuItemForQuota.split(',')[1].split(':')[1];

  quotaList.forEach((volume) => {
    menuItemConstructorOptions.push({
      label: `${t('server.volume')} ${volume.name}`,
      enabled: false,
    });
    menuItemConstructorOptions.push({ type: 'separator' });
    volume.children.forEach((share) => {
      menuItemConstructorOptions.push({
        label: `volume:${volume.name},${share.name}`,
        enabled: true,
        type: 'checkbox',
        checked: volume.name === targetVolumeName && share.name === `share:${targetShareName}`,
      });
    });
  });

  return { menuItemConstructorOptions };
};

export default useMenuConstructorOptionsForQuota;

export type MenuItemConstructorOptionsInQuota = ReturnType<
  typeof useMenuConstructorOptionsForQuota
>['menuItemConstructorOptions'];
