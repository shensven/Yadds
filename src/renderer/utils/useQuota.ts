import { useAtom } from 'jotai';
import byteSize from 'byte-size';
import { find } from 'lodash';
import { atomPersistenceTargeMenuItemForQuota, atomQuotaList, atomTargeByteSizeForQuota, Share } from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomFetchStatus } from '../atoms/atomTask';

const useQuota = () => {
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setQuotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota, setTargeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [, setTargeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);
  const [, setFetchStatus] = useAtom(atomFetchStatus);

  const resetQuota = () => {
    setQuotaList([]);
    setTargeByteSizeForQuota({
      max: { value: '-', unit: '', long: '', toString: () => '' },
      available: { value: '-', unit: '', long: '', toString: () => '' },
    });
  };

  const resetTargetMenuItem = () => {
    setTargeMenuItemForQuota(`volume:${0},share:${''}`);
  };

  const getQuota = async () => {
    const targetUser = find(connectedUsers, { did: targetDid });

    if (!targetUser) {
      resetQuota();
      return;
    }

    try {
      const resp = await window.electron.net.getQuata({
        host: targetUser.host,
        port: targetUser.port,
        sid: targetUser.sid,
      });

      // console.log('getQuata', resp);

      if (!resp.success) {
        setFetchStatus('pending');
        resetQuota();
      } else {
        setQuotaList(resp.data.items);
        window.electron?.contextMenuForQuota.setTargetItem(setTargeMenuItemForQuota);

        const targetVolume = find(resp.data.items, {
          name: targeMenuItemForQuota.split(',')[0].split(':')[1].toString(),
        });

        if (targetVolume !== undefined) {
          const targetQuota = find(targetVolume.children, {
            name: targeMenuItemForQuota.split(',')[1],
          }) as Share | undefined;

          if (targetQuota) {
            setFetchStatus('polling');
            setTargeByteSizeForQuota({
              max: byteSize(targetQuota.share_quota * 1024 * 1024, { units: 'iec', precision: 2 }),
              available: byteSize((targetQuota.share_quota - targetQuota.share_used) * 1024 * 1024, {
                units: 'iec',
                precision: 2,
              }),
            });
          }
        }
      }
    } catch (error) {
      setFetchStatus('pending');
      resetQuota();
      console.log(error);
    }
  };

  return { getQuota, resetQuota, resetTargetMenuItem };
};

export default useQuota;
