import { net } from 'electron';

export type PropsPingPongHost = {
  host: string;
  port: number;
  isHtpps: boolean;
};

export interface PingPongHostInfo {
  boot_done: true;
  disk_hibernation: boolean;
  ezid: string;
  success: true;
}

const pingPongHost = async (props: PropsPingPongHost) => {
  const { host, port, isHtpps } = props;

  const options = {
    method: 'GET',
    protocol: isHtpps ? 'https:' : 'http:',
    hostname: host,
    path: '/webman/pingpong.cgi',
    port,
    headers: {
      cookie: 'type=tunnel; Path=/',
    },
  };

  return new Promise<PingPongHostInfo>((resolve, reject) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      reject(new Error(`[PingPongHost] [Timeout] ${isHtpps ? 'https' : 'http'}://${host}:${port}`));
    }, 5000);

    request.on('error', reject);

    request.on('response', (response: Electron.IncomingMessage) => {
      const data: Uint8Array[] | Buffer[] = [];

      response.on('data', (chunk: Buffer) => {
        data.push(chunk);
      });

      response.on('end', () => {
        const json = Buffer.concat(data).toString();
        const parsed = JSON.parse(json);
        resolve(parsed);
      });
    });

    request.end();
  });
};

export default pingPongHost;
