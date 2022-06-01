import { net } from 'electron';
import queryString from 'query-string';

export interface DsmInfo {
  success: true;
  data: {
    codepage: string; // "chs"
    model: string; // "DS920+"
    ram: number; // 4096
    serial: string; // 2XXXXXXXXX
    temperature: number; // 52
    temperature_warn: boolean;
    time: string; // "Wed Jun  1 22:29:14 2022"
    uptime: number; // 1587787
    version: string; // 42661
    version_string: string; // DSM 7.1-42661 Update 1
  };
}

const getDsmInfo = (args: { host: string; port: number; sid: string }) => {
  const { host, port, sid } = args;
  if (!(host || port || sid)) {
    return { success: false };
  }

  const params = {
    api: 'SYNO.DSM.Info',
    version: 2,
    method: 'getinfo',
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

  return new Promise<DsmInfo>((resolve, reject) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      reject(new Error(`[SYNO.DSM.Info] [Timeout] https://${host}:${port}`));
    }, 3000);

    request.on('error', () => reject);

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

export default getDsmInfo;
