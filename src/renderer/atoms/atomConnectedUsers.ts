import { atom } from 'jotai';

export interface ConnectedUser {
  connectType: 'qc' | 'host';
  host: string;
  port: number;
  isHttps: boolean;
  username: string;
  did: string;
  sid: string;
  quickConnectID?: string;
  controlHost?: string;
}

const atomConnectedUsers = atom<ConnectedUser[]>(
  (window.electron?.connectedUsers.get('list') as ConnectedUser[] | undefined) ?? []
);
export const atomPersistenceConnectedUsers = atom(
  (get) => get(atomConnectedUsers),
  (_get, set, newArr: ConnectedUser[]) => {
    set(atomConnectedUsers, newArr);
    window.electron.connectedUsers.set('list', newArr);
  }
);

// -----------------------------------------------------------------------------

const atomTargetDid = atom<string>((window.electron?.connectedUsers.get('target') as string | undefined) ?? '');
export const atomPersistenceTargetDid = atom(
  (get) => get(atomTargetDid),
  (_get, set, newStr: string) => {
    set(atomTargetDid, newStr);
    window.electron.connectedUsers.set('target', newStr);
  }
);
