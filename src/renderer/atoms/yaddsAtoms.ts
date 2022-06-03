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
  additional: {
    detail: {
      completed_time: number; // 1652972006
      connected_leechers: number; // 0
      connected_peers: number; // 0
      connected_seeders: number; // 0
      create_time: number; // 1652971223
      destination: string; // "your/path"
      unzip_password: string;
      seed_elapsed: number; // 5400
      started_time: number; // 1652971324
      total_peers: number; // 0
      total_pieces: number; // 720
      uri: string; //  "magnet:?xt=urn:btih:65042f531b707fexxxxxxxxxxxxxxxxxx"
      waiting_seconds: number; // 0
    };
    transfer: {
      downloaded_pieces: number; // 0
      size_downloaded: number; // 6015112485
      size_uploaded: number; // 1860587615
      speed_download: number; // 0
      speed_upload: number; // 0
    };
  };
  id: string; // "dbid_1220"
  size: number; // 6015112485
  status: number | string; // 5
  title: string; //  "Fantastic.Beasts.The.Secrets.of.Dumbledore.2022.1080p.KORSUB.HDRip.x264.AAC2.0-SHITBOX"
  type: string; // "bt"
  username: string; // "your-dsm-username"
}

export const sidebarWidth = atom<240>(240);

export const tasksRetry = atom<3>(3);

// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------

export const tasksAtom = atom<DSTasks[]>([]);

export const tasksStatusAtom = atom({ isLoading: true, retry: 0 });

// -----------------------------------------------------------------------------

export const dsmInfoAtom = atom({ model: '-', version: '-' });

// -----------------------------------------------------------------------------

export interface ShareQuota {
  expanded: boolean;
  leaf: boolean;
  name: `share:${string}`; // 'share:Your_Root_Path';
  quota: number;
  share_quota: number;
  share_used: number;
  used: number;
}
export interface Volume {
  children: ShareQuota[];
  expanded: boolean;
  leaf: boolean;
  name: string; // '1'
  quota: string; // 'NotSupport'
  share_quota: string; // 'NotSupport'
  share_used: string; // 'NotSupport'
  used: string; // 'NotSupport'
}
export const atomDsmQuotaList = atom<Volume[]>([]);

// -----------------------------------------------------------------------------

export type PageServerQuotaTargetItem = `volume:${number},share:${string}`;
export const atomPageServerQuotaTargetItem = atom<PageServerQuotaTargetItem>(`volume:${0},share:${''}`);

// -----------------------------------------------------------------------------

export const atomPageServerQuotaTargetValue = atom({ maxQuota: 'N/A', availableCapacity: 'N/A' });
