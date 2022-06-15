import { useAtom } from 'jotai';
import byteSize from 'byte-size';
import { find } from 'lodash';
import { atomPersistenceTargeMenuItemForQuota, atomQuotaList, atomTargeByteSizeForQuota, Share } from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';

const useQuota = () => {
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setQuotaList] = useAtom(atomQuotaList);
  const [targeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [, setTargeByteSizeForQuota] = useAtom(atomTargeByteSizeForQuota);

  const getQuota = async () => {
    const targetUser = find(connectedUsers, { did: targetDid });

    if (!targetUser) {
      return;
    }

    try {
      const resp = await window.electron.net.getQuata({
        host: targetUser.host,
        port: targetUser.port,
        sid: targetUser.sid,
      });

      console.log('getQuata', resp.data.items);

      if (resp.success) {
        setQuotaList(resp.data.items);

        const targetVolume = find(resp.data.items, {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  return getQuota;
};

export default useQuota;
