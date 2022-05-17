import { net } from 'electron';
import { ErrorInfoSummary } from './ErrorInfoSummary';

export interface ServerInfo {
  version: number;
  command: string;
  errno: number;
  suberrno?: number;
  errinfo?: string;
  sites?: string[];
  env?: {
    control_host: string;
    relay_region: string;
  };
  server?: {
    ddns: string;
    ds_state: string;
    external: {
      ip: string;
      ipv6: string;
    };
    fqdn: string;
    gateway: string;
    interface: {
      ip: string;
      ipv6: {
        addr_type: number;
        address: string;
        prefix_length: number;
        scope: string;
      }[];
      mask: string;
      name: string;
    }[];
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

export interface ServerError {
  success: false;
  quickConnectID: string;
  errorInfoSummary: ErrorInfoSummary;
  errorInfoDetail: string;
}

/**
 * @param quickConnectID your-quickconnect-id
 * @param controlHost cnc.quickconnect.cn
 */
const queryCoordinator = async (quickConnectID: string, controlHost?: string) => {
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

  return new Promise<ServerInfo | ServerError>((resolve) => {
    const request = net.request(options);

    request.write(body);

    setTimeout(() => {
      request.abort();
      resolve({
        success: false,
        quickConnectID,
        errorInfoSummary: 'timeout',
        errorInfoDetail: `[Get Server Info] [Timeout] https://${controlHost ?? 'global.quickconnect.to'}/Serv.php`,
      });
    }, 5000);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        try {
          const respParsed: ServerInfo = JSON.parse(chunk.toString());
          resolve(respParsed);
        } catch {
          resolve({
            success: false,
            quickConnectID,
            errorInfoSummary: 'invalid_request',
            errorInfoDetail: `[Get Server Info] [Invalid Request] https://${
              controlHost ?? 'global.quickconnect.to'
            }/Serv.php`,
          });
        }
      });
    });

    request.on('error', () => {
      resolve({
        success: false,
        quickConnectID,
        errorInfoSummary: 'invalid_request',
        errorInfoDetail: `[Get Server Info] [Invalid Request] https://${
          controlHost ?? 'global.quickconnect.to'
        }/Serv.php`,
      });
    });

    request.end();
  });
};

const getServerInfo = async (quickConnectID: string): Promise<ServerInfo | ServerError> => {
  const respViaGlobal = await queryCoordinator(quickConnectID);

  // When any errors are returned
  if ((respViaGlobal as ServerError).success === false) {
    return respViaGlobal;
  }

  // When error info 'get_server_info.go:69[Alias not found]' is returned
  if ((respViaGlobal as ServerInfo).errno === 4 && (respViaGlobal as ServerInfo).suberrno === 1) {
    return {
      success: false,
      quickConnectID,
      errorInfoSummary: 'quickconnect_id_is_incorrect_or_does_not_exist',
      errorInfoDetail: '[Get Server Info via Global] QuickConnect ID is incorrect or does not exist',
    };
  }

  // When error info 'get_server_info.go:88[Ds info not found]' is returned
  if ((respViaGlobal as ServerInfo).errno === 4 && (respViaGlobal as ServerInfo).suberrno === 2) {
    const respViaControlHost = await queryCoordinator(quickConnectID, (respViaGlobal as ServerInfo).sites![0]);

    if ((respViaControlHost as ServerError).success === false) {
      return respViaControlHost;
    }

    if ((respViaControlHost as ServerInfo).errno === 4 && (respViaControlHost as ServerInfo).suberrno === 1) {
      return {
        success: false,
        quickConnectID,
        errorInfoSummary: 'quickconnect_id_is_incorrect_or_does_not_exist',
        errorInfoDetail: '[Get Server Info via Control Host] QuickConnect ID is incorrect or does not exist',
      };
    }

    if ((respViaControlHost as ServerInfo).errno === 0) {
      return respViaControlHost;
    }
  }

  // When the correct info is returned
  if ((respViaGlobal as ServerInfo).errno === 0) {
    return respViaGlobal;
  }

  return {
    success: false,
    quickConnectID,
    errorInfoSummary: 'unknown_error',
    errorInfoDetail: '[Get Server Info] [Unknown Error]',
  };
};

export default getServerInfo;
