import { net } from 'electron';
import queryString from 'query-string';
import { Task } from '../../renderer/atoms/atomTask';

export interface TasksInfo {
  data: {
    offset: number; // 0
    task: Task[];
    total: number;
  };
  success: true;
}

export interface TasksError {
  error: {
    code: number;
  };
  success: false;
}

// ---------------------------------------------------------------------------------------------------------------------

const poll = (args: { host: string; port: number; sid: string }) => {
  const { host, port, sid } = args;

  const params = {
    api: 'SYNO.DownloadStation2.Task',
    version: 2,
    method: 'list',
    additional: `["detail", "transfer"]`,
  };

  const options = {
    method: 'GET',
    protocol: 'https:',
    hostname: host,
    port,
    path: `webapi/entry.cgi?${queryString.stringify(params)}`,
    headers: {
      cookie: `type=tunnel; Path=/; id=${sid}`,
    },
  };

  return new Promise<TasksInfo | TasksError>((resolve, reject) => {
    const request = net.request(options);

    setTimeout(() => {
      request.abort();
      reject(new Error(`[SYNO.DownloadStation2.Task] [Timeout] https://${host}:${port}`));
    }, 3000);

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

export default poll;
