import axios from 'axios';

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

async function requestCoordinator(quickConnectID: string) {
  const resp = await axios.post(
    'https://global.quickconnect.to/Serv.php',
    JSON.stringify({
      version: 1,
      command: 'request_tunnel',
      stop_when_error: false,
      stop_when_success: false,
      id: 'dsm_portal_https',
      serverID: quickConnectID,
      is_gofile: false,
    })
  );

  return resp.data;
}

async function requestPingPong(quickConnectID: string, serverInfo: ServerInfo) {
  if (serverInfo.errno !== 0) {
    return 'bad request https://global.quickconnect.to/Serv.php';
  }

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

  const newInstance = async (baseURL: string) => {
    const appAxios = axios.create({ baseURL });

    appAxios.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    appAxios.interceptors.response.use(
      (config) => {
        console.log(`good response ${baseURL}`);
        return config;
      },
      (error) => {
        console.log(`bad response ${baseURL}`);
        return Promise.reject(error);
      }
    );

    const resp = await appAxios.get(PINGPONG_PATH, {
      headers: {
        Cookie: 'type=tunnel; Path=/',
      },
    });
    return resp.data;
  };

  return Promise.race([
    newInstance(`https://${SMARTDNS_LAN}:${PORT}`),
    newInstance(`https://${SMARTDNS_HOST}:${PORT}`),
    newInstance(`https://${SMARTDNS_HOST}:${EXT_PORT}`),
    newInstance(`https://${WAN_IP}:${PORT}`),
    newInstance(`https://${WAN_IP}:${EXT_PORT}`),
    newInstance(`https://${quickConnectID}.${RELAY_HOST}`),
  ]);
}

export default async function auth(quickConnectID: string) {
  const serverInfo = await requestCoordinator(quickConnectID);
  const pingpongInfo = await requestPingPong(quickConnectID, serverInfo);
  return pingpongInfo;
}
