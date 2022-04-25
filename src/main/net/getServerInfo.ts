import { net } from 'electron';

export interface ServerInfo {
  errno: number;
  command?: string;
  version?: number;
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

const getServerInfo = async (quickConnectID: string) => {
  const options = {
    method: 'POST',
    protocol: 'https:',
    hostname: 'global.quickconnect.to',
    path: '/Serv.php',
  };

  const body = JSON.stringify({
    version: 1,
    command: 'get_server_info',
    stop_when_error: false,
    stop_when_success: false,
    id: 'dsm_portal_https',
    serverID: quickConnectID,
    is_gofile: false,
  });

  return new Promise<ServerInfo>((resolve) => {
    const request = net.request(options);

    request.write(body);

    setTimeout(() => {
      request.abort();
      resolve({ errno: -1 });
    }, 5000);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        const parsed: ServerInfo = JSON.parse(chunk.toString());
        resolve(parsed);
      });
    });

    request.on('error', () => {
      console.log(`main: bad request https://global.quickconnect.to/Serv.php`);
      resolve({ errno: -1 });
    });

    request.end();
  });
};

export default getServerInfo;
