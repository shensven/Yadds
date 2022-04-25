import { net } from 'electron';
import queryString from 'query-string';

interface DsmInfo {
  success: boolean;
  data?: {
    codepage: string;
    model: string;
    ram: number;
    serial: string;
    temperature: number;
    temperature_warn: boolean;
    time: string;
    uptime: number;
    version: string;
    version_string: string;
  };
}

export default async function getDsmInfo(args: { host: string; port: number; sid: string }) {
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

  return new Promise<DsmInfo>((resolve) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      resolve({ success: false });
    }, 3000);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        try {
          const parsed: DsmInfo = JSON.parse(chunk.toString());
          resolve(parsed);
        } catch {
          resolve({ success: false });
        }
      });
    });

    request.on('error', () => {
      console.log(`main: bad request https://${host}/webapi/entry.cgi?${queryString.stringify(params)}`);
      resolve({ success: false });
    });

    request.end();
  });
}
