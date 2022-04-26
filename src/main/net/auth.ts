import getServerInfo, { ServerError, ServerInfo } from './getServerInfo';
import pingPong, { PingPongError, PingPongInfo } from './pingPong';
import signIn from './signIn';

const auth = async (args: { quickConnectID: string; account: string; passwd: string }) => {
  const { quickConnectID, account, passwd } = args;

  const serverInfo = await getServerInfo(quickConnectID);

  if ((serverInfo as ServerError).success === false) {
    return serverInfo;
  }

  const pingPongInfo = await pingPong(quickConnectID, serverInfo as ServerInfo);

  if ((pingPongInfo as PingPongError).success === false) {
    return pingPongInfo;
  }

  const signInInfo = await signIn(quickConnectID, pingPongInfo as PingPongInfo, account, passwd);

  return signInInfo;
};

export default auth;
