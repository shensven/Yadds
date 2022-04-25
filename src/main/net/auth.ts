import getServerInfo from './getServerInfo';
import pingPong from './pingpong';
import signIn from './signIn';

const auth = async (args: { quickConnectID: string; account: string; passwd: string }) => {
  const { quickConnectID, account, passwd } = args;

  const serverInfo = await getServerInfo(quickConnectID);

  if (serverInfo.errno !== 0) {
    switch (serverInfo.errno) {
      case 4:
        return {
          msg: `${quickConnectID} is not a valid QuickConnect ID`,
          errCode: '024',
          success: false,
        };
      case 9:
        return {
          msg: 'QuickConnect ID is incorrect or does not exist',
          errCode: '01',
          success: false,
        };
      default:
        return {
          msg: 'Unable to connect to QuickConnect coordinator',
          errCode: '02',
          success: false,
        };
    }
  }

  const pingpongInfo = await pingPong({ quickConnectID, serverInfo });

  if (pingpongInfo.success === false) {
    return {
      msg: `unable to connect to https://${pingpongInfo.hostname}:${pingpongInfo.port}`,
      errCode: '03',
      success: false,
    };
  }

  const signInInfo = await signIn({ pingpongInfo, account, passwd });

  if (signInInfo.success === false) {
    return {
      msg: 'Wrong account or password',
      errCode: '04',
      success: false,
    };
  }

  return signInInfo;
};

export default auth;
