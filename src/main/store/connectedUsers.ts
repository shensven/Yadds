import Store, { Schema } from 'electron-store';
import { ConnectedUser } from '../../renderer/atoms/atomConnectedUsers';

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
        host: { type: 'string' },
        port: { type: 'number' },
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

const connectedUsers = new Store<YaddsConnectedUsers>({ schema, clearInvalidConfig: true });

export default connectedUsers;
