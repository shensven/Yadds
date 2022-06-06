import { MenuItemConstructorOptions } from 'electron';
import { TFunction } from 'react-i18next';
import { TargeMenuItemForQuota, Volume } from '../atoms/atomTask';

const createMenuItemConstructorOptionsForQuota = (
  t: TFunction<'translation', undefined>,
  dsmQuotaList: Volume[],
  targeMenuItemForQuota: TargeMenuItemForQuota
) => {
  const template: MenuItemConstructorOptions[] = [];

  const targetVolume = targeMenuItemForQuota.split(',')[0].split(':')[1];
  const targetQuotaName = targeMenuItemForQuota.split(',')[1].split(':')[1];

  dsmQuotaList.forEach((volume) => {
    template.push({
      label: `${t('server.volume')} ${volume.name}`,
      enabled: false,
    });
    template.push({ type: 'separator' });
    volume.children.forEach((shareQuota) => {
      template.push({
        label: `volume:${volume.name},${shareQuota.name}`,
        enabled: true,
        type: 'checkbox',
        checked: volume.name === targetVolume && shareQuota.name === `share:${targetQuotaName}`,
      });
    });
  });

  return template;
};

export default createMenuItemConstructorOptionsForQuota;

export type MenuItemConstructorOptionsForQuota = ReturnType<typeof createMenuItemConstructorOptionsForQuota>;
