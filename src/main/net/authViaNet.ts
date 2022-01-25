import { net } from 'electron';

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

export default function requestCoordinator(quickConnectID: string) {
  const options = {
    protocol: 'https:',
    hostname: 'global.quickconnect.to',
    path: '/Serv.php',
    method: 'POST',
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
