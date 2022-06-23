import { useAtom } from 'jotai';
import { find } from 'lodash';
import byteSize from 'byte-size';
import { atomPersistenceTargeMenuItemForQuota, atomQuotaList, atomTargeByteSizeForQuota, Share } from '../atoms/atomUI';

const useByteSizeForQuota = () => {
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
        setTargeByteSizeForQuota({
          max: byteSize(targetQuota.share_quota * 1024 * 1024, { units: 'iec', precision: 2 }),
          available: byteSize((targetQuota.share_quota - targetQuota.share_used) * 1024 * 1024, {
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
