import { useAtom } from 'jotai';
import { find } from 'lodash';
import byteSize from 'byte-size';
import {
  atomPersistenceTargeMenuItemForQuota,
  atomQuotaList,
  atomTargeByteSizeForQuota,
  atomVolumeList,
  Share,
} from '../atoms/atomUI';

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
      name: targeMenuItemForQuota.split(',')[0].split(':')[1].toString(),
    });

    if (targetVolume !== undefined) {
      const targetQuota = find(targetVolume.children, {
        name: targeMenuItemForQuota.split(',')[1],
      }) as Share | undefined;

      if (targetQuota) {
        const targetQuotaName = targetQuota.name.split(':')[1];

        const targetShareInFileStation = find(volumeList, {
          name: targetQuotaName,
        });

        const getMax = () => {
          let shareQuota = 0;
          let quota = 0;

          if (targetQuota.share_quota === 0) {
            shareQuota = targetShareInFileStation!.additional.volume_status.totalspace;
          } else {
            shareQuota = targetQuota.share_quota * 1024 * 1024;
          }

          if (targetQuota.quota === 0) {
            quota = targetShareInFileStation!.additional.volume_status.totalspace;
          } else {
            quota = targetQuota.quota * 1024 * 1024;
          }

          if (shareQuota < quota) {
            return shareQuota;
          }
          return quota;
        };

        const getAvailable = () => {
          if (getMax() === targetShareInFileStation!.additional.volume_status.totalspace) {
            return targetShareInFileStation!.additional.volume_status.freespace;
          }
          return getMax() - targetQuota.share_used * 1024 * 1024;
        };

        setTargeByteSizeForQuota({
          max: byteSize(getMax(), { units: 'iec', precision: 2 }),
          available: byteSize(getAvailable(), {
            units: 'iec',
            precision: 2,
          }),
        });
      }
    }
  };

  return { updateByteSize, resetByteSize };
};

export default useByteSizeForQuota;
