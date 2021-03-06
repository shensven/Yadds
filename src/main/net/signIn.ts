import { net } from 'electron';
import queryString from 'query-string';

export type PropsSignIn = {
  host: string;
  port: number;
  username: string;
  passwd: string;
};

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
  host: string;
  port: number;
}

const signIn = (props: PropsSignIn) => {
  const { host, port, username, passwd } = props;

  const params = {
    api: 'SYNO.API.Auth',
    version: 6,
    method: 'login',
    account: username,
    passwd,
  };

  const options = {
    method: 'GET',
    protocol: 'https:',
    hostname: host,
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
      reject(new Error(`[SYNO.API.Auth] [Timeout] https://${host}:${port}`));
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

        parsed.host = host;
        parsed.port = port;

        resolve(parsed);
      });
    });

    request.end();
  });
};

export default signIn;
