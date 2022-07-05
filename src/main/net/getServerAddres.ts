import findServer from './findServer';
import pingPongQC from './pingPongQC';

export type PropQuickConnectID = string;

const getServerAddress = async (quickConnectID: PropQuickConnectID) => {
  const serverInfo = await findServer(quickConnectID);

  if (serverInfo.errno !== 0) {
    return serverInfo;
  }

  const pingPongInfo = await pingPongQC(quickConnectID, serverInfo);

  return pingPongInfo;
};

export default getServerAddress;
