import { MenuItemConstructorOptions } from 'electron';
import { TFunction } from 'react-i18next';
import { TargeMenuItemForQuota, Volume } from '../atoms/atomUI';

const createMenuItemConstructorOptionsForQuota = (
  t: TFunction<'translation', undefined>,
  quotaList: Volume[],
  targeMenuItemForQuota: TargeMenuItemForQuota
) => {
  const template: MenuItemConstructorOptions[] = [];

  const targetVolumeName = targeMenuItemForQuota.split(',')[0].split(':')[1];
  const targetShareName = targeMenuItemForQuota.split(',')[1].split(':')[1];

  quotaList.forEach((volume) => {
    template.push({
      label: `${t('server.volume')} ${volume.name}`,
      enabled: false,
    });
    template.push({ type: 'separator' });
    volume.children.forEach((share) => {
      template.push({
        label: `volume:${volume.name},${share.name}`,
        enabled: true,
        type: 'checkbox',
        checked: volume.name === targetVolumeName && share.name === `share:${targetShareName}`,
      });
    });
  });

  return template;
};

export default createMenuItemConstructorOptionsForQuota;

export type MenuItemConstructorOptionsForQuota = ReturnType<typeof createMenuItemConstructorOptionsForQuota>;
