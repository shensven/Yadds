import { net } from 'electron';
import queryString from 'query-string';

interface ServerInfo {
  command: string;
  version: number;
  errno: number;
  errinfo?: string;
  env?: { control_host: string; relay_region: string };
  server?: {
    ddns: string;
    ds_state: string;
    external: { ip: string; ipv6: string };
    fqdn: string;
    gateway: string;
    interface: { ip: string; ipv6: any[]; mask: string; name: string }[];
    ipv6_tunnel: any[];
    pingpong_path: string;
    redirect_prefix: string;
    serverID: string;
    tcp_punch_port: number;
    udp_punch_port: number;
  };
  service?: {
    port: number;
    ext_port: number;
    pingpong: string;
    pingpong_desc: any[];
    relay_ip: string;
    relay_dn: string;
    relay_port: number;
    https_ip: string;
    https_port: number;
  };
  smartdns?: { host: string; lan: string[]; hole_punch: string };
}

interface PingpongInfo {
  ezid: string;
  success: boolean;
  hostname: string;
  port: number;
}

interface LoginInfo {
  success: boolean;
  data: {
    did?: string;
    sid?: string;
    code?: number;
  };
  hostname: string;
  port: number;
}

async function requestCoordinator(quickConnectID: string) {
  const options = {
    method: 'POST',
    protocol: 'https:',
    hostname: 'global.quickconnect.to',
    path: '/Serv.php',
  };

  const body = JSON.stringify({
    version: 1,
    command: 'request_tunnel',
    stop_when_error: false,
    stop_when_success: false,
    id: 'dsm_portal_https',
    serverID: quickConnectID,
    is_gofile: false,
  });

  return new Promise<ServerInfo>((resolve, reject) => {
    const request = net.request(options);

    request.write(body);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        const parsed: ServerInfo = JSON.parse(chunk.toString());
        resolve(parsed);
      });
    });

    request.on('error', (error: Error) => {
      reject(error);
    });

    request.end();
  });
}

async function requestPingPong(quickConnectID: string, serverInfo: ServerInfo) {
  // 5001
  const PORT = serverInfo.service?.port as number;

  // 65500
  const EXT_PORT = serverInfo.service?.ext_port as number;

  // /webman/pingpong.cgi?action=cors&quickconnect=true
  const PINGPONG_PATH = serverInfo.server?.pingpong_path as string;

  // 192.168.x.xxx
  // const LAN_IP = serverInfo.server?.interface[0].ip as string;

  // 192-168-x-xxx.Your-QuickConnect-ID.direct.quickconnect.to
  const SMARTDNS_LAN = serverInfo.smartdns?.lan[0] as string;

  // Your-QuickConnect-ID.direct.quickconnect.to
  const SMARTDNS_HOST = serverInfo.smartdns?.host as string;

  // 221.213.xxx.xxx
  const WAN_IP = serverInfo.server?.external.ip as string;

  // cn3.quickconnect.cn
  const RELAY_HOST = `${serverInfo.env?.relay_region}.${serverInfo.env?.control_host.split('.').slice(-2).join('.')}`;

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

    return new Promise<PingpongInfo>((resolve, reject) => {
      const request = net.request(options);

      request.on('response', (response: Electron.IncomingMessage) => {
        response.on('data', (chunk: Buffer) => {
          const parsed: PingpongInfo = JSON.parse(chunk.toString());
          parsed.hostname = hostname;
          parsed.port = port;
          resolve(parsed);
        });
      });

      request.on('error', (error: Error) => {
        reject(error);
      });

      request.end();
    });
  };

  return Promise.race([
    newInstance(SMARTDNS_LAN, PORT),
    newInstance(SMARTDNS_HOST, PORT),
    newInstance(SMARTDNS_HOST, EXT_PORT),
    newInstance(WAN_IP, PORT),
    newInstance(WAN_IP, EXT_PORT),
    newInstance(`${quickConnectID}.${RELAY_HOST}`, 443),
  ]);
}

async function requestLogin(pingpongInfo: PingpongInfo, account: string, passwd: string) {
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

  return new Promise<LoginInfo>((resolve, reject) => {
    const request = net.request(options);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        const parsed: LoginInfo = JSON.parse(chunk.toString());
        parsed.hostname = pingpongInfo.hostname;
        parsed.port = pingpongInfo.port;
        resolve(parsed);
      });
    });

    request.on('error', (error: Error) => {
      reject(error);
    });

    request.end();
  });
}

export default async function auth(quickConnectID: string, account: string, passwd: string) {
  if (quickConnectID.length === 0) {
    return 'QuickConnect ID is empty';
  }
  const serverInfo = await requestCoordinator(quickConnectID);

  if (serverInfo.errno !== 0) {
    return 'bad request https://global.quickconnect.to/Serv.php';
  }
  const pingpongInfo = await requestPingPong(quickConnectID, serverInfo);

  if (pingpongInfo.success === false) {
    return `ban request https://${pingpongInfo.hostname}:${pingpongInfo.port}`;
  }
  const loginInfo = await requestLogin(pingpongInfo, account, passwd);

  if (loginInfo.success === false) {
    return 'access denied';
  }
  return loginInfo;
}
