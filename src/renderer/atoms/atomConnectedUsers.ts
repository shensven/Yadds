import { atom } from 'jotai';

export interface ConnectedUser {
  host: string;
  port: number;
  username: string;
  did: string;
  sid: string;
  quickConnectID?: string;
  controlHost?: string;
}

const atomConnectedUsers = atom<ConnectedUser[]>(
  (window.electron?.store.get('dsmConnectList') as ConnectedUser[] | undefined) ?? []
);
export const atomPersistenceConnectedUsers = atom(
  (get) => get(atomConnectedUsers),
  (_get, set, newArr: ConnectedUser[]) => {
    set(atomConnectedUsers, newArr);
    window.electron.store.set('dsmConnectList', newArr);
  }
);

// -----------------------------------------------------------------------------

const atomTargetSid = atom<string>((window.electron?.store.get('dsmCurrentSid') as string | undefined) ?? '');
export const atomPersistenceTargetSid = atom(
  (get) => get(atomTargetSid),
  (_get, set, newStr: string) => {
    set(atomTargetSid, newStr);
    window.electron.store.set('dsmCurrentSid', newStr);
  }
);
