import { useAtom } from 'jotai';
import { find } from 'lodash';
import { atomNasInfo } from '../atoms/atomUI';
import { atomPersistenceConnectedUsers, atomPersistenceTargetDid } from '../atoms/atomConnectedUsers';

const useNasInfo = () => {
  const [connectedUsers] = useAtom(atomPersistenceConnectedUsers);
  const [targetDid] = useAtom(atomPersistenceTargetDid);
  const [, setNasInfo] = useAtom(atomNasInfo);

  const getNasInfo = async () => {
    const targetUser = find(connectedUsers, { did: targetDid });

    if (!targetUser) return;

    try {
      const resp = await window.electron.net.getDsmInfo({
        host: targetUser.host,
        port: targetUser.port,
        sid: targetUser.sid,
      });

      console.log('getDsmInfo', resp);

      if (resp.success) {
        const version = resp.data.version_string.split(' ')[1] as string;
        setNasInfo({ model: resp.data.model as string, version });
      } else {
        setNasInfo({ model: '-', version: '-' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return getNasInfo;
};

export default useNasInfo;
