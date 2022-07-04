import findServer from './findServer';
import pingPong from './pingPong';

export type PropQuickConnectID = string;

const getServerAddress = async (quickConnectID: PropQuickConnectID) => {
  const serverInfo = await findServer(quickConnectID);

  if (serverInfo.errno !== 0) {
    return serverInfo;
  }

  const pingPongInfo = await pingPong(quickConnectID, serverInfo);

  return pingPongInfo;
};

export default getServerAddress;
