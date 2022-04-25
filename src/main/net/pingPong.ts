import { net } from 'electron';
import { ServerInfo } from './getServerInfo';

export interface PingPongInfo {
  success: boolean;
  hostname: string;
  port: number;
  ezid?: string;
}

const pingPong = (args: { quickConnectID: string; serverInfo: ServerInfo }) => {
  const { quickConnectID, serverInfo } = args;

  // 5001
  const PORT = serverInfo.service?.port as number;

  // 65500
  const EXT_PORT = serverInfo.service?.ext_port as number;

  // /webman/pingpong.cgi?action=cors&quickconnect=true
  const PINGPONG_PATH = serverInfo.server?.pingpong_path as string;

  // 192-168-x-xxx.YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  const SMART_LAN = serverInfo.smartdns?.lan as string[];
  // const SMART_LAN = [] as string[];

  // syn6-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  const SMART_LAN_V6 = serverInfo.smartdns?.lanv6 as string[];
  // const SMART_LAN_V6 = [] as string[];

  // YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  const SMART_HOST = serverInfo.smartdns?.host as string;

  // cn3.quickconnect.cn
  const RELAY_HOST = `${serverInfo.env?.relay_region}.${serverInfo.env?.control_host.split('.').slice(-2).join('.')}`;

  // 192.168.x.xxx
  // const LAN_IP = serverInfo.server?.interface[0].ip as string;

  // 221.213.xxx.xxx
  // const WAN_IP = serverInfo.server?.external.ip as string;

  const newInstance = async (hostname: string, port: number) => {
    const options = {
      method: 'GET',
      protocol: 'https:',
      hostname,
      path: PINGPONG_PATH,
      port,
      headers: {
        cookie: 'type=tunnel; Path=/',
      },
    };

    return new Promise<PingPongInfo>((resolve) => {
      const request = net.request(options);

      setTimeout(() => {
        request.abort();
        resolve({ success: false, hostname, port });
      }, 5000);

      request.on('response', (response: Electron.IncomingMessage) => {
        response.on('data', (chunk: Buffer) => {
          const parsed: PingPongInfo = JSON.parse(chunk.toString());
          parsed.hostname = hostname;
          parsed.port = port;
          resolve(parsed);
        });
      });

      request.on('error', () => {
        resolve({ success: false, hostname, port });
      });

      request.end();
    });
  };

  const ADDRESS_SETS: { url: string; port: number }[] = [];

  if (SMART_LAN.length > 0) {
    SMART_LAN.forEach((lan: string) => {
      ADDRESS_SETS.push({ url: lan, port: PORT });
    });
  }

  if (SMART_LAN_V6.length > 0) {
    SMART_LAN_V6.forEach((lanv6: string) => {
      ADDRESS_SETS.push({ url: lanv6, port: PORT });
      ADDRESS_SETS.push({ url: lanv6, port: EXT_PORT });
    });
  }

  ADDRESS_SETS.push({ url: SMART_HOST, port: PORT });
  ADDRESS_SETS.push({ url: SMART_HOST, port: EXT_PORT });
  ADDRESS_SETS.push({ url: `${quickConnectID}.${RELAY_HOST}`, port: 443 });

  const INSTANCE_SETS = ADDRESS_SETS.map(({ url, port }) => newInstance(url, port));

  return Promise.race(INSTANCE_SETS);
};

export default pingPong;
