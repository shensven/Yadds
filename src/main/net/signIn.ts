import { net } from 'electron';
import queryString from 'query-string';
import { PingPongInfo } from './pingpong';

export interface SignInInfo {
  success: boolean;
  data: {
    did?: string;
    sid?: string;
    code?: number;
  };
  hostname: string;
  port: number;
}

const signIn = (args: { pingpongInfo: PingPongInfo; account: string; passwd: string }) => {
  const { pingpongInfo, account, passwd } = args;

  const params = {
    api: 'SYNO.API.Auth',
    version: 3,
    method: 'login',
    account,
    passwd,
    session: 'DownloadStation',
    format: 'cookie',
  };

  const options = {
    method: 'GET',
    protocol: 'https:',
    hostname: pingpongInfo.hostname,
    port: pingpongInfo.port,
    path: `webapi/auth.cgi?${queryString.stringify(params)}`,
    headers: {
      cookie: 'type=tunnel; Path=/',
    },
  };

  return new Promise<SignInInfo>((resolve, reject) => {
    const request = net.request(options);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        const parsed: SignInInfo = JSON.parse(chunk.toString());
        parsed.hostname = pingpongInfo.hostname;
        parsed.port = pingpongInfo.port;
        console.log(parsed);
        resolve(parsed);
      });
    });

    request.on('error', (error: Error) => {
      console.log(
        `main: bad request https://${pingpongInfo.hostname}:${
          pingpongInfo.port
        }/webapi/auth.cgi?${queryString.stringify(params)}`
      );
      reject(error);
    });

    request.end();
  });
};

export default signIn;
