import { net } from 'electron';
import queryString from 'query-string';

interface TaskInfo {
  data: {
    offset: number;
    tasks: {
      id: string;
      size: number;
      status: string;
      title: string;
      type: string;
      username: string;
    }[];
    total: number;
  };
  success: boolean;
}

async function requestTasks(args: { host: string; port: number; sid: string }) {
  const { host, port, sid } = args;

  const params = {
    api: 'SYNO.DownloadStation.Task',
    version: 3,
    method: 'list',
  };

  const options = {
    method: 'GET',
    protocol: 'https:',
    hostname: host,
    port,
    path: `webapi/DownloadStation/task.cgi?${queryString.stringify(params)}`,
    headers: {
      cookie: `type=tunnel; Path=/; id=${sid}`,
    },
  };

  return new Promise<TaskInfo>((resolve, reject) => {
    const request = net.request(options);

    request.on('response', (response: Electron.IncomingMessage) => {
      response.on('data', (chunk: Buffer) => {
        const parsed: TaskInfo = JSON.parse(chunk.toString());
        resolve(parsed);
      });
    });

    request.on('error', (error: Error) => {
      reject(error);
    });

    request.end();
  });
}

export default async function poll(args: { host: string; port: number; sid: string }) {
  const { host, port, sid } = args;
  if (!(host || port || sid)) {
    return { success: false };
  }
  const tasks = await requestTasks(args);
  return tasks;
}
