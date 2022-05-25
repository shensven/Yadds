import { atom } from 'jotai';

export type YaddsCategoryPath =
  | '/queueAll'
  | '/queueDownloading'
  | '/queueFinished'
  | '/queueActive'
  | '/queueInactive'
  | '/queueStopped'
  | '/server'
  | '/settings';

export type YaddsAppearance = 'light' | 'dark' | 'system';

export interface DsmConnectListType {
  host: string;
  port: number;
  username: string;
  did: string;
  sid: string;
  quickConnectID?: string;
  controlHost?: string;
}

export type YaddsI18nCode = 'en' | 'zh_CN' | 'zh_TW' | 'ja_JP';

export interface DSTasks {
  id: string;
  size: number;
  status: string | number;
  title: string;
  type: string;
  username?: string;
  additional?: {
    detail: {
      completed_time: number;
      connected_leechers: number;
      connected_peers: number;
      connected_seeders: number;
      create_time: number;
      destination: string;
      hash: string;
      lastSeenComplete: number;
      priority: string;
      seedelapsed: number;
      started_time: number;
      total_peers: number;
      total_pieces: number;
      unzip_password: string;
      uri: string;
      waiting_seconds: number;
    };
    transfer: {
      downloaded_pieces: number;
      size_downloaded: number;
      size_uploaded: number;
      speed_download: number;
      speed_upload: number;
    };
    seconds_left: string;
  };
}

export const sidebarWidth = atom<240>(240);

export const tasksRetry = atom<3>(3);

// ---------------------------------------------------------------------------------------------------------------------

export const hasYaddsSidebarMarginTopAtom = atom<boolean>(true);

const hasYaddsSidebarAtom = atom<boolean>(
  (window.electron?.store.get('hasYaddsSidebar') as boolean | undefined) ?? true
);
export const hasYaddsSidebarAtomWithPersistence = atom(
  (get) => get(hasYaddsSidebarAtom),
  (_get, set, newBool: boolean) => {
    set(hasYaddsSidebarAtom, newBool);
    window.electron.store.set('hasYaddsSidebar', newBool);
  }
);

const yaddsSidebarCategoryAtom = atom<YaddsCategoryPath>(
  (window.electron?.store.get('yaddsSidebarCategory') as YaddsCategoryPath | undefined) ?? '/queueAll'
);
export const yaddsSidebarCategoryAtomWithPersistence = atom(
  (get) => get(yaddsSidebarCategoryAtom),
  (_get, set, newStr: YaddsCategoryPath) => {
    set(yaddsSidebarCategoryAtom, newStr);
    window.electron.store.set('yaddsSidebarCategory', newStr);
  }
);

const yaddsMainOrderIteraterAtom = atom<string>(
  (window.electron?.store.get('yaddsMainOrderIterater') as string | undefined) ?? 'date'
);
export const yaddsMainOrderIteraterAtomWithPersistence = atom(
  (get) => get(yaddsMainOrderIteraterAtom),
  (_get, set, newStr: string) => {
    set(yaddsMainOrderIteraterAtom, newStr);
    window.electron.store.set('yaddsMainOrderIterater', newStr);
  }
);

const yaddsMainOrderIsAscendAtom = atom<boolean>(
  (window.electron?.store.get('yaddsMainOrderIsAscend') as boolean | undefined) ?? true
);
export const yaddsMainOrderIsAscendAtomWithPersistence = atom(
  (get) => get(yaddsMainOrderIsAscendAtom),
  (_get, set, newBool: boolean) => {
    set(yaddsMainOrderIsAscendAtom, newBool);
    window.electron.store.set('yaddsMainOrderIsAscend', newBool);
  }
);

const yaddsAppearanceAtom = atom<YaddsAppearance>(
  (window.electron?.store.get('yaddsAppearance') as YaddsAppearance | undefined) ?? 'system'
);
export const yaddsAppearanceAtomWithPersistence = atom(
  (get) => get(yaddsAppearanceAtom),
  (_get, set, newStr: YaddsAppearance) => {
    set(yaddsAppearanceAtom, newStr);
    window.electron.store.set('yaddsAppearance', newStr);
  }
);

const yaddsI18nCodeAtom = atom<YaddsI18nCode>(
  (window.electron?.store.get('yaddsI18nCode') as YaddsI18nCode | undefined) ?? 'en'
);
export const yaddsI18nCodeAtomWithPersistence = atom(
  (get) => get(yaddsI18nCodeAtom),
  (_get, set, newStr: YaddsI18nCode) => {
    set(yaddsI18nCodeAtom, newStr);
    window.electron.store.set('yaddsI18nCode', newStr);
  }
);

const isYaddsAutoLaunchAtom = atom<boolean>(
  (window.electron?.store.get('isYaddsAutoLaunch') as boolean | undefined) ?? false
);
export const isYaddsAutoLaunchAtomWithPersistence = atom(
  (get) => get(isYaddsAutoLaunchAtom),
  (_get, set, newBool: boolean) => {
    set(isYaddsAutoLaunchAtom, newBool);
    window.electron.store.set('isYaddsAutoLaunch', newBool);
  }
);

const isYaddsAutoUpdateAtom = atom<boolean>(
  (window.electron?.store.get('isYaddsAutoUpdate') as boolean | undefined) ?? true
);
export const isYaddsAutoUpdateAtomWithPersistence = atom(
  (get) => get(isYaddsAutoUpdateAtom),
  (_get, set, newBool: boolean) => {
    set(isYaddsAutoUpdateAtom, newBool);
    window.electron.store.set('isYaddsAutoUpdate', newBool);
  }
);

// ---------------------------------------------------------------------------------------------------------------------

const dsmConnectListAtom = atom<DsmConnectListType[]>(
  (window.electron?.store.get('dsmConnectList') as DsmConnectListType[] | undefined) ?? []
);
export const dsmConnectListAtomWithPersistence = atom(
  (get) => get(dsmConnectListAtom),
  (_get, set, newArr: DsmConnectListType[]) => {
    set(dsmConnectListAtom, newArr);
    window.electron.store.set('dsmConnectList', newArr);
  }
);

const dsmCurrentSidAtom = atom<string>((window.electron?.store.get('dsmCurrentSid') as string | undefined) ?? '');
export const dsmCurrentSidAtomWithPersistence = atom(
  (get) => get(dsmCurrentSidAtom),
  (_get, set, newStr: string) => {
    set(dsmCurrentSidAtom, newStr);
    window.electron.store.set('dsmCurrentSid', newStr);
  }
);

// ---------------------------------------------------------------------------------------------------------------------

export const tasksAtom = atom<DSTasks[]>([]);

export const tasksStatusAtom = atom({
  isLoading: true,
  retry: 0,
});

export const dsmInfoAtom = atom({
  model: '-',
  version: '-',
});
