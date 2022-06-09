import { net } from 'electron';
import queryString from 'query-string';
import { Volume } from '../../renderer/atoms/atomUI';

export interface PersonalSettingsInfo {
  success: true;
  data: {
    items: Volume[];
    total: number;
  };
}

const getQuota = async (args: { host: string; port: number; sid: string }) => {
  const { host, port, sid } = args;

  const params = {
    api: 'SYNO.Core.PersonalSettings',
    version: 1,
    method: 'quota',
  };

  const options = {
    method: 'GET',
    protocol: 'https:',
    hostname: host,
    port,
    path: `webapi/entry.cgi?${queryString.stringify(params)}`,
    headers: {
      cookie: `type=tunnel; Path=/; id=${sid}`,
    },
  };

  return new Promise<PersonalSettingsInfo>((resolve, reject) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      reject(new Error(`[SYNO.Core.PersonalSettings] [Timeout] https://${host}:${port}`));
    }, 3000);

    request.on('error', reject);

    request.on('response', (response: Electron.IncomingMessage) => {
      const data: Uint8Array[] | Buffer[] = [];

      response.on('data', (chunk: Buffer) => {
        data.push(chunk);
      });

      response.on('end', () => {
        const json = Buffer.concat(data).toString();
        resolve(JSON.parse(json));
      });
    });

    request.end();
  });
};

export default getQuota;
