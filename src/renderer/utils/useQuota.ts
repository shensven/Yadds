import { startTransition } from 'react';
import { useAtom } from 'jotai';
import { find } from 'lodash';
import { atomPersistenceTargeMenuItemForQuota, atomQuotaList } from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomFetchStatus } from '../atoms/atomTask';
import useByteSizeForQuota from './useByteSizeForQuota';

const useQuota = () => {
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setQuotaList] = useAtom(atomQuotaList);
  const [, setTargeMenuItemForQuota] = useAtom(atomPersistenceTargeMenuItemForQuota);
  const [, setFetchStatus] = useAtom(atomFetchStatus);

  const { resetByteSize: resizeByteSizeForQuota } = useByteSizeForQuota();

  const resetQuota = () => {
    setQuotaList([]);
    resizeByteSizeForQuota();
  };

  const resetTargetMenuItem = () => {
    setTargeMenuItemForQuota('');
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
        setFetchStatus('polling');
        startTransition(() => setQuotaList(resp.data.items));
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
