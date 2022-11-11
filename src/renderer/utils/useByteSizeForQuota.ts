import { useAtom } from 'jotai';
import { find } from 'lodash';
import byteSize from 'byte-size';
import {
  atomPersistenceTargeMenuItemForQuota,
  atomQuotaList,
  atomTargeByteSizeForQuota,
  atomVolumeList,
  Share,
} from '@/renderer/atoms/atomUI';

const useByteSizeForQuota = () => {
  const [volumeList] = useAtom(atomVolumeList);
  const [quotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [, setTargeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);

  const resetByteSize = () => {
    setTargeByteSizeForQuota({
      max: { value: '-', unit: '', long: '', toString: () => '' },
      available: { value: '-', unit: '', long: '', toString: () => '' },
    });
  };

  const updateByteSize = () => {
    const targetVolume = find(quotaList, {
      name: targeMenuItemForQuota.split(',')[0].split(':')[1],
    });

    if (!targetVolume) return;

    const targetQuota = find(targetVolume.children, {
      name: targeMenuItemForQuota.split(',')[1],
    }) as Share | undefined;

    if (!targetQuota) return;

    const targetShareInFileStation = find(volumeList, {
      name: targetQuota.name.split(':')[1],
    });

    if (!targetShareInFileStation) return;

    if (targetQuota.share_quota === 0 && targetQuota.quota === 0) {
      setTargeByteSizeForQuota({
        max: { value: '∞', unit: '', long: '', toString: () => '' },
        available: byteSize(targetShareInFileStation.additional.volume_status.freespace, {
          units: 'iec',
          precision: 2,
        }),
      });
    } else if (targetQuota.share_quota !== 0 && targetQuota.quota !== 0) {
      setTargeByteSizeForQuota({
        max: byteSize(Math.min(targetQuota.share_quota, targetQuota.quota) * 1024 * 1024, {
          units: 'iec',
          precision: 2,
        }),
        available: byteSize(
          (Math.min(targetQuota.share_quota, targetQuota.quota) - targetQuota.share_used) * 1024 * 1024,
          {
            units: 'iec',
            precision: 2,
          }
        ),
      });
    } else {
      setTargeByteSizeForQuota({
        max: byteSize((targetQuota.share_quota || targetQuota.quota) * 1024 * 1024, {
          units: 'iec',
          precision: 2,
        }),
        available: byteSize(((targetQuota.share_quota || targetQuota.quota) - targetQuota.share_used) * 1024 * 1024, {
          units: 'iec',
          precision: 2,
        }),
      });
    }
  };

  return { updateByteSize, resetByteSize };
};

export default useByteSizeForQuota;
