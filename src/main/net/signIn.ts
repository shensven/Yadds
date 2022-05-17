import { net } from 'electron';
import queryString from 'query-string';
import { ErrorInfoSummary } from './ErrorInfoSummary';
import { PingPongInfo } from './pingPong';

export interface SignInError {
  success: false;
  quickConnectID: string;
  errorInfoSummary: ErrorInfoSummary;
  errorInfoDetail: string;
}

export interface SignInWrongAccountOrPasswd {
  success: false;
  error: {
    code: 400;
  };
}
export interface SignInInfo {
  success: true;
  data: {
    did: string;
    sid: string;
    is_portal_port?: boolean;
  };
  quickConnectID: string;
  hostname: string;
  port: number;
}

const signIn = (quickConnectID: string, pingPongInfo: PingPongInfo, account: string, passwd: string) => {
  const { hostname, port } = pingPongInfo;

  const params = {
    api: 'SYNO.API.Auth',
    version: 6,
    method: 'login',
    account,
    passwd,
  };

  const options = {
    method: 'GET',
    protocol: 'https:',
    hostname,
    port,
    path: `webapi/entry.cgi?${queryString.stringify(params)}`,
    headers: {
      cookie: 'type=tunnel; Path=/',
    },
  };

  return new Promise<SignInInfo | SignInError>((resolve) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      resolve({
        success: false,
        quickConnectID,
        errorInfoSummary: 'timeout',
        errorInfoDetail: `[SYNO.API.Auth] [Timeout] https://${hostname}:${port}`,
      });
    }, 10000);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        try {
          const parsed = JSON.parse(chunk.toString());

          if (
            (parsed as SignInWrongAccountOrPasswd).success === false &&
            (parsed as SignInWrongAccountOrPasswd).error.code === 400
          ) {
            resolve({
              success: false,
              quickConnectID,
              errorInfoSummary: 'wrong_account_or_password',
              errorInfoDetail: `[SYNO.API.Auth] [Wrong Account or Password] https://${hostname}:${port}`,
            });
          }

          parsed.hostname = hostname;
          parsed.port = port;

          resolve({
            success: true,
            data: {
              did: parsed.data.did,
              sid: parsed.data.sid,
            },
            quickConnectID,
            hostname,
            port,
          });
        } catch {
          resolve({
            success: false,
            quickConnectID,
            errorInfoSummary: 'invalid_request',
            errorInfoDetail: `[SYNO.API.Auth] [Invalid Request] https://${hostname}:${port}`,
          });
        }
      });
    });

    request.on('error', () => {
      resolve({
        success: false,
        quickConnectID,
        errorInfoSummary: 'invalid_request',
        errorInfoDetail: `[SYNO.API.Auth] [Invalid Request] https://${hostname}:${port}`,
      });
    });

    request.end();
  });
};

export default signIn;
