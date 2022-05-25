import { net } from 'electron';

export interface ServerInfo {
  command: 'get_server_info';
  env: {
    control_host: string; // "cnc.quickconnect.cn"
    relay_region: string; // "cn3"
  };
  errno: 0;
  server: {
    ddns: string; // "your-quickconnect-id.synology.me"
    ds_state: 'CONNECTED';
    external: {
      ip: string; // "221.213.xxx.xxx"
      ipv6: string; // "::"
    };
    fqdn: 'NULL';
    gateway: string; // "192.168.1.1"
    interface: {
      ip: string; // "192.168.1.111"
      ipv6: {
        addr_type: 0 | 32;
        address: string; // "2408:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"
        prefix_length: 64;
        scope: 'global' | 'link';
      }[];
      mask: string; // "255.255.255.0"
      name: string; // "eth0"
    }[];
    ipv6_tunnel: unknown[];
    pingpong_path: '/webman/pingpong.cgi?action=cors&quickconnect=true';
    redirect_prefix: string; // ""
    serverID: string; // "05xxxxxxx"
    tcp_punch_port: number; // 0
    udp_punch_port: number; // 52xx
  };
  service: {
    port: number; // 5001
    ext_port: number; // 0
    pingpong: 'DISCONNECTED';
    pingpong_desc: unknown[];
    relay_ip: string; // "103.78.xxx.xxx"
    relay_dn: string; // "synr-cn3.your-quickconnect-id.direct.quickconnect.to"
    relay_port: number; // 47xxx
    https_ip: string; // "103.78.xxx.xxx"
    https_port: number; // 443
  };
  smartdns?: {
    host: string; // "your-quickconnect-id.direct.quickconnect.to"
    lan: string[]; // "192-168-1-111.your-quickconnect-id.direct.quickconnect.to"
    lanv6: string[]; // "syn6-5helxxxxxxxxxxxx.your-quickconnect-id.direct.quickconnect.to",
    hole_punch: string; // "127-0-0-1.your-quickconnect-id.direct.quickconnect.to"
  };
  version: number; // 1
}

export interface ServerError {
  command: 'get_server_info';
  errinfo:
    | 'get_server_info.go:69[Alias not found]'
    | 'get_server_info.go:88[Ds info not found]'
    | 'get_server_info.go:79[Violation of the use regulations.]'
    | 'get_server_info.go:105[]'
    | 'get_server_info.go:42[]';
  errno:
    | 9 // quickConnectID.length === 0
    | 4 // Alias not found or Ds info not found
    | 30; // Violation of the use regulations
  version: 1;
  suberrno?:
    | 0 //
    | 1 // Alias not found in global
    | 2; // Ds info not found in global, but found in control host
  reason?: string;
  sites?: string[]; // [ "cnc.quickconnect.cn" ]
}

/**
 * @param quickConnectID your-quickconnect-id
 * @param controlHost cnc.quickconnect.cn
 */
const queryCoordinator = (quickConnectID: string, controlHost?: string) => {
  const options = {
    method: 'POST',
    protocol: 'https:',
    hostname: controlHost ?? 'global.quickconnect.to',
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

  return new Promise<ServerInfo | ServerError>((resolve, reject) => {
    const request = net.request(options);

    request.write(body);

    setTimeout(() => {
      request.abort();
      reject(new Error(`[Get Server Info] [Timeout] https://${controlHost ?? 'global.quickconnect.to'}/Serv.php`));
    }, 5000);

    request.on('error', reject);

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

const getServerInfo = async (quickConnectID: string): Promise<ServerInfo | ServerError> => {
  const respViaGlobal = await queryCoordinator(quickConnectID);

  // When error info 'get_server_info.go:69[Alias not found]' is returned
  if ((respViaGlobal as ServerError).errno === 4 && (respViaGlobal as ServerError).suberrno === 1) {
    return respViaGlobal;
  }

  // When error info 'get_server_info.go:88[Ds info not found]' is returned
  if ((respViaGlobal as ServerError).errno === 4 && (respViaGlobal as ServerError).suberrno === 2) {
    const respViaControlHost = await queryCoordinator(quickConnectID, (respViaGlobal as ServerError).sites![0]);

    // When error info 'get_server_info.go:88[Ds info not found]' is returned
    if ((respViaControlHost as ServerError).errno === 4 && (respViaControlHost as ServerError).suberrno === 2) {
      const subControlHost = [...(respViaControlHost as ServerError).sites!];

      const respViaFinal = subControlHost.map(async (site) => {
        const respViaIterator = await queryCoordinator(quickConnectID, site);

        if ((respViaIterator as ServerError).errno === 4 && (respViaIterator as ServerError).suberrno === 2) {
          return Promise.reject(new Error(`[Get Server Info] [Cannot connect] https://${site}/Serv.php`));
        }

        return Promise.resolve(respViaIterator as ServerInfo);
      });

      return Promise.any(respViaFinal);
    }

    return respViaControlHost as ServerInfo;
  }

  return respViaGlobal as ServerInfo;
};

export default getServerInfo;
