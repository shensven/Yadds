import { net } from 'electron';
import queryString from 'query-string';
import { PingPongInfo } from './pingPong';

export interface SignInWrongAccountOrPasswd {
  success: false;
  error: {
    code: 400;
  };
}
export interface SignInInfo {
  success: true;
  data: {
    did: string;
    sid: string;
    is_portal_port?: boolean;
  };
  quickConnectID: string;
  hostname: string;
  port: number;
}

const signIn = (quickConnectID: string, pingPongInfo: PingPongInfo, account: string, passwd: string) => {
  const { hostname, port } = pingPongInfo;

  const params = {
    api: 'SYNO.API.Auth',
    version: 6,
    method: 'login',
    account,
    passwd,
  };

  const options = {
    method: 'GET',
    protocol: 'https:',
    hostname,
    port,
    path: `webapi/entry.cgi?${queryString.stringify(params)}`,
    headers: {
      cookie: 'type=tunnel; Path=/',
    },
  };

  return new Promise<SignInInfo | SignInWrongAccountOrPasswd>((resolve, reject) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      reject(new Error(`[SYNO.API.Auth] [Timeout] https://${hostname}:${port}`));
    }, 10000);

    request.on('error', reject);

    request.on('response', (response: Electron.IncomingMessage) => {
      const data: Uint8Array[] | Buffer[] = [];

      response.on('data', (chunk: Buffer) => {
        data.push(chunk);
      });

      response.on('end', () => {
        const json = Buffer.concat(data).toString();
        const parsed = JSON.parse(json);

        parsed.quickConnectID = quickConnectID;
        parsed.hostname = hostname;
        parsed.port = port;

        resolve(parsed);
      });
    });

    request.end();
  });
};

export default signIn;
