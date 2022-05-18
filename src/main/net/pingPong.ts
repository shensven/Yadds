import { net } from 'electron';
import { ErrorInfoSummary } from './ErrorInfoSummary';
import { ServerInfo } from './getServerInfo';

export interface PingPongInfo {
  success: boolean;
  hostname: string;
  port: number;
  ezid?: string;
}

export interface PingPongError {
  success: false;
  quickConnectID: string;
  errorInfoSummary: ErrorInfoSummary;
  errorInfoDetail: string;
}

const pingPong = (quickConnectID: string, serverInfo: ServerInfo) => {
  // 5001
  const PORT = serverInfo.service?.port as number;

  // 65500
  // const EXT_PORT = serverInfo.service?.ext_port as number;

  // /webman/pingpong.cgi?action=cors&quickconnect=true
  const PINGPONG_PATH = serverInfo.server?.pingpong_path as string;

  // cn3.quickconnect.cn
  const RELAY_HOST = `${serverInfo.env?.relay_region}.${serverInfo.env?.control_host.split('.').slice(-2).join('.')}`;

  // DDNS
  const DDNS = serverInfo.server?.ddns as string;

  // 192-168-x-xxx.YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  const SMART_LAN = serverInfo.smartdns?.lan as string[];

  // syn6-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  const SMART_LAN_V6 = serverInfo.smartdns?.lanv6 as string[];

  // YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  // const SMART_HOST = serverInfo.smartdns?.host as string;

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

    return new Promise<PingPongInfo | PingPongError>((resolve) => {
      const request = net.request(options);

      setTimeout(() => {
        request.abort();
        resolve({
          success: false,
          quickConnectID,
          errorInfoSummary: 'timeout',
          errorInfoDetail: `[PingPong] [Timeout] https://${hostname}:${port}`,
        });
      }, 5000);

      request.on('error', () => {
        resolve({
          success: false,
          quickConnectID,
          errorInfoSummary: 'invalid_request',
          errorInfoDetail: `[PingPong] [Invalid Request] https://${hostname}:${port}`,
        });
      });

      request.on('response', (response: Electron.IncomingMessage) => {
        response.on('data', (chunk: Buffer) => {
          try {
            const parsed: PingPongInfo = JSON.parse(chunk.toString());
            parsed.hostname = hostname;
            parsed.port = port;
            resolve(parsed);
          } catch {
            resolve({
              success: false,
              quickConnectID,
              errorInfoSummary: 'invalid_request',
              errorInfoDetail: `[PingPong] [Invalid Request] https://${hostname}:${port}`,
            });
          }
        });
      });

      request.end();
    });
  };

  const ADDRESS_SETS: { url: string; port: number }[] = [];

  ADDRESS_SETS.push({ url: `${quickConnectID}.${RELAY_HOST}`, port: 443 });

  if (DDNS !== 'NULL') {
    ADDRESS_SETS.push({ url: DDNS, port: PORT });
  }

  if (SMART_LAN.length > 0) {
    SMART_LAN.forEach((lan: string) => {
      ADDRESS_SETS.push({ url: lan, port: PORT });
    });
  }

  if (SMART_LAN_V6.length > 0) {
    SMART_LAN_V6.forEach((lanv6: string) => {
      ADDRESS_SETS.push({ url: lanv6, port: PORT });
      // ADDRESS_SETS.push({ url: lanv6, port: EXT_PORT });
    });
  }

  // ADDRESS_SETS.push({ url: SMART_HOST, port: PORT });
  // ADDRESS_SETS.push({ url: SMART_HOST, port: EXT_PORT });

  const INSTANCE_SETS = ADDRESS_SETS.map(({ url, port }) => {
    return newInstance(url, port);
  });

  return Promise.race(INSTANCE_SETS);
};

export default pingPong;
