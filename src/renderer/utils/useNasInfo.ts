import { useAtom } from 'jotai';
import { find } from 'lodash';
import { atomNasInfo } from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';
import { atomFetchStatus } from '../atoms/atomTask';

const useNasInfo = () => {
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setNasInfo] = useAtom(atomNasInfo);
  const [, setFetchStatus] = useAtom(atomFetchStatus);

  const resetNasInfo = () => {
    setNasInfo({ model: '-', version: '-' });
  };

  const getNasInfo = async () => {
    const targetUser = find(connectedUsers, { did: targetDid });

    if (!targetUser) {
      resetNasInfo();
      return;
    }

    try {
      const resp = await window.electron.net.getDsmInfo({
        host: targetUser.host,
        port: targetUser.port,
        sid: targetUser.sid,
      });

      // console.log('getDsmInfo', resp);

      if (!resp.success) {
        setFetchStatus('pending');
        resetNasInfo();
      } else {
        setFetchStatus('polling');
        const version = resp.data.version_string.split(' ')[1] as string;
        setNasInfo({ model: resp.data.model as string, version });
      }
    } catch (error) {
      setFetchStatus('pending');
      resetNasInfo();
      console.log(error);
    }
  };

  return { getNasInfo, resetNasInfo };
};

export default useNasInfo;
