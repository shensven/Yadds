import { net } from 'electron';
import queryString from 'query-string';

export type PropsAuthType = {
  host: string;
  port: number;
  username: string;
};

export interface AuthTypeInfo {
  success: true;
  data: {
    type: 'passwd' | 'authenticator' | 'fido';
  }[];
}

const getAuthType = (props: PropsAuthType) => {
  const { host, port, username } = props;

  const params = {
    api: 'SYNO.API.Auth.Type',
    method: 'get',
    version: 1,
    account: username,
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

  return new Promise<AuthTypeInfo>((resolve, reject) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      reject(new Error(`[Get User Type] [Timeout] https://${host}/webapi/entry.cgi?${queryString.stringify(params)}`));
    }, 5000);

    request.on('error', reject);

    request.on('response', (response: Electron.IncomingMessage) => {
      const data: Uint8Array[] | Buffer[] = [];

      response.on('data', (chunk: Buffer) => {
        data.push(chunk);
      });

      response.on('end', () => {
        const json = Buffer.concat(data).toString();
        console.log(JSON.parse(json));
        resolve(JSON.parse(json));
      });
    });

    request.end();
  });
};

export default getAuthType;
