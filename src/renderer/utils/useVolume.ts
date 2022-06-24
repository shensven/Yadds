import { useAtom } from 'jotai';
import { find } from 'lodash';
import { atomVolumeList } from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomFetchStatus } from '../atoms/atomTask';

const useVolume = () => {
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setVolumeList] = useAtom(atomVolumeList);
  const [, setFetchStatus] = useAtom(atomFetchStatus);

  const resetVolume = () => {
    setVolumeList([]);
  };

  const getVolume = async () => {
    const targetUser = find(connectedUsers, { did: targetDid });

    if (!targetUser) {
      resetVolume();
      return;
    }
    try {
      const resp = await window.electron.net.getVolume({
        host: targetUser.host,
        port: targetUser.port,
        sid: targetUser.sid,
      });

      if (!resp.success) {
        setFetchStatus('pending');
        resetVolume();
      } else {
        setFetchStatus('polling');
        setVolumeList(resp.data.shares);
      }
    } catch (error) {
      setFetchStatus('pending');
      resetVolume();
      console.log(error);
    }
  };

  return { getVolume, resetVolume };
};

export default useVolume;
