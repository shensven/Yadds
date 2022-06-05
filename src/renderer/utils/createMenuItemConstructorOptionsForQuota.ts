import { MenuItemConstructorOptions } from 'electron';
import { TFunction } from 'react-i18next';
import { PageServerQuotaTargetItem, Volume } from '../atoms/atomTask';

const createMenuItemConstructorOptionsForQuota = (
  t: TFunction<'translation', undefined>,
  dsmQuotaList: Volume[],
  pageServerQuotaTargeItem: PageServerQuotaTargetItem
) => {
  const template: MenuItemConstructorOptions[] = [];

  const targetVolume = pageServerQuotaTargeItem.split(',')[0].split(':')[1];
  const targetQuotaName = pageServerQuotaTargeItem.split(',')[1].split(':')[1];

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
