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
  smartdns?: {
    host: string;
    lan: string[];
    lanv6: string[];
    hole_punch: string;
  };
}

interface PingpongInfo {
  success: boolean;
  hostname: string;
  port: number;
  ezid?: string;
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

  // 192-168-x-xxx.YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  const SMART_LAN = serverInfo.smartdns?.lan as string[];

  // syn6-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.YOUR-QUICKCONNECT-ID.direct.quickconnect.to
  const SMART_LAN_V6 = serverInfo.smartdns?.lanv6 as string[];

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

    return new Promise<PingpongInfo>((resolve, reject) => {
      const request = net.request(options);

      setTimeout(() => {
        request.abort();
        resolve({ success: false, hostname, port });
      }, 5000);

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
    return {
      msg: 'QuickConnect ID is incorrect or does not exist',
      errCode: '01',
      success: false,
    };
  }
  const serverInfo = await requestCoordinator(quickConnectID);

  if (serverInfo.errno !== 0) {
    switch (serverInfo.errno) {
      case 4:
        return {
          msg: `${quickConnectID} is not a valid QuickConnect ID`,
          errCode: '024',
          success: false,
        };
      case 9:
        return {
          msg: 'QuickConnect ID is incorrect or does not exist',
          errCode: '01',
          success: false,
        };
      default:
        return {
          msg: 'Unable to connect to QuickConnect coordinator',
          errCode: '02',
          success: false,
        };
    }
  }
  const pingpongInfo = await requestPingPong(quickConnectID, serverInfo);

  if (pingpongInfo.success === false) {
    return {
      msg: `unable to connect to https://${pingpongInfo.hostname}:${pingpongInfo.port}`,
      errCode: '03',
      success: false,
    };
  }
  const loginInfo = await requestLogin(pingpongInfo, account, passwd);

  if (loginInfo.success === false) {
    return {
      msg: 'Wrong account or password',
      errCode: '04',
      success: false,
    };
  }
  return loginInfo;
}
