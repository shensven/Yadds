import { SetStateAction } from 'jotai';
import { find } from 'lodash';
import { NasInfo } from '../atoms/atomUI';
import { ConnectedUser } from '../atoms/atomConnectedUsers';

interface Args {
  connectedUsers: ConnectedUser[];
  targetDid: string;
  setNasInfo: (update: SetStateAction<NasInfo>) => void;
}

const getNasInfo = async (args: Args) => {
  const { connectedUsers, targetDid, setNasInfo } = args;

  const targetUser = find(connectedUsers, { did: targetDid });

  if (!targetUser) {
    return;
  }

  try {
    const resp = await window.electron.net.getDsmInfo({
      host: targetUser.host,
      port: targetUser.port,
      sid: targetUser.sid,
    });

    console.log('getDsmInfo', resp);

    if (resp.success) {
      const version = resp.data.version_string.split(' ')[1] as string;
      setNasInfo({
        model: resp.data.model as string,
        version,
      });
    } else {
      setNasInfo({
        model: '-',
        version: '-',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default getNasInfo;
