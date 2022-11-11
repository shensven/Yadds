import Store, { Schema } from 'electron-store';
import { ConnectedUser } from '@/renderer/atoms/atomConnectedUsers';

export type YaddsConnectedUsers = {
  list: ConnectedUser[];
  target: string;
};

const schema: Schema<YaddsConnectedUsers> = {
  list: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        connectType: { type: 'string' },
        host: { type: 'string' },
        port: { type: 'number' },
        isHttps: { type: 'boolean' },
        username: { type: 'string' },
        did: { type: 'string' },
        sid: { type: 'string' },
        quickConnectID: { type: 'string' },
      },
    },
  },
  target: {
    type: 'string',
  },
};

const connectedUsers = new Store<YaddsConnectedUsers>({
  name: 'connectedUsers',
  schema,
  clearInvalidConfig: true,
});

export default connectedUsers;
