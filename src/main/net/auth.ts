import getServerInfo from './getServerInfo';

import pingPong from './pingPong';
import signIn from './signIn';

const auth = async (args: { quickConnectID: string; account: string; passwd: string }) => {
  const { quickConnectID, account, passwd } = args;

  const serverInfo = await getServerInfo(quickConnectID);

  if (serverInfo.errno !== 0) {
    return serverInfo;
  }

  const pingPongInfo = await pingPong(quickConnectID, serverInfo);

  if (!pingPongInfo.success) {
    return pingPongInfo;
  }

  const signInInfo = await signIn(quickConnectID, pingPongInfo, account, passwd);

  return signInInfo;
};

export default auth;
