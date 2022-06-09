import { atom } from 'jotai';

// Sidebar
// -----------------------------------------------------------------------------

export const atomHasSidebarMarginTop = atom<boolean>(true);

const atomHasSidebar = atom<boolean>((window.electron?.cache.get('hasSidebar') as boolean | undefined) ?? true);
export const atomPersistenceHasSidebar = atom(
  (get) => get(atomHasSidebar),
  (_get, set, newBool: boolean) => {
    set(atomHasSidebar, newBool);
    window.electron.cache.set('hasSidebar', newBool);
  }
);

export type SidebarCategory =
  | '/queueAll'
  | '/queueDownloading'
  | '/queueFinished'
  | '/queueActive'
  | '/queueInactive'
  | '/queueStopped'
  | '/server'
  | '/settings';

const atomSidebarCategory = atom<SidebarCategory>(
  (window.electron?.cache.get('sidebarCategory') as SidebarCategory | undefined) ?? '/queueAll'
);
export const atomPersistenceSidebarCategory = atom(
  (get) => get(atomSidebarCategory),
  (_get, set, newStr: SidebarCategory) => {
    set(atomSidebarCategory, newStr);
    window.electron.cache.set('sidebarCategory', newStr);
  }
);

// Queue
// -----------------------------------------------------------------------------

export type QueueIterater = 'date' | 'title' | 'download_progress' | 'download_speed';

const atomQueueIterater = atom<QueueIterater>(
  (window.electron?.cache.get('queueIterater') as QueueIterater | undefined) ?? 'date'
);
export const atomPersistenceQueueIterater = atom(
  (get) => get(atomQueueIterater),
  (_get, set, newStr: QueueIterater) => {
    set(atomQueueIterater, newStr);
    window.electron.cache.set('queueIterater', newStr);
  }
);

const atomQueueIsAscend = atom<boolean>((window.electron?.cache.get('queueIsAscend') as boolean | undefined) ?? true);
export const atomPersistenceQueueIsAscend = atom(
  (get) => get(atomQueueIsAscend),
  (_get, set, newBool: boolean) => {
    set(atomQueueIsAscend, newBool);
    window.electron.cache.set('queueIsAscend', newBool);
  }
);

// Server
// -----------------------------------------------------------------------------

export type ServerActiveTab = 'basicInfomation' | 'route' | 'responsiveness';

const atomServerActiveTab = atom<ServerActiveTab>(
  (window.electron?.cache.get('serverActiveTab') as ServerActiveTab | undefined) ?? 'basicInfomation'
);
export const atomPersistenceServerActiveTab = atom(
  (get) => get(atomServerActiveTab),
  (_get, set, newStr: ServerActiveTab) => {
    set(atomServerActiveTab, newStr);
    window.electron.cache.set('serverActiveTab', newStr);
  }
);

export const atomNasInfo = atom({ model: '-', version: '-' });

export type TargeMenuItemForQuota = `volume:${number},share:${string}`;

const atomTargeMenuItemForQuota = atom<TargeMenuItemForQuota>(
  (window.electron?.cache.get('targeMenuItemForQuota') as TargeMenuItemForQuota | undefined) ??
    `volume:${0},share:${''}`
);
export const atomPersistenceTargeMenuItemForQuota = atom(
  (get) => get(atomTargeMenuItemForQuota),
  (_get, set, newStr: TargeMenuItemForQuota) => {
    set(atomTargeMenuItemForQuota, newStr);
    window.electron.cache.set('targeMenuItemForQuota', newStr);
  }
);

// Settings
// -----------------------------------------------------------------------------

export type Appearance = 'light' | 'dark' | 'system';

const atomAppearance = atom<Appearance>(
  (window.electron?.preferences.get('appearance') as Appearance | undefined) ?? 'system'
);
export const atomPersistenceAppearance = atom(
  (get) => get(atomAppearance),
  (_get, set, newStr: Appearance) => {
    set(atomAppearance, newStr);
    window.electron.preferences.set('appearance', newStr);
  }
);

export type LocaleName = 'en' | 'zh_CN' | 'zh_TW' | 'ja_JP';

const atomLocaleName = atom<LocaleName>((window.electron?.preferences.get('locale') as LocaleName | undefined) ?? 'en');
export const atomPersistenceLocaleName = atom(
  (get) => get(atomLocaleName),
  (_get, set, newStr: LocaleName) => {
    set(atomLocaleName, newStr);
    window.electron.preferences.set('locale', newStr);
  }
);

const atomIsAutoLaunch = atom<boolean>(
  (window.electron?.preferences.get('isAutoLaunch') as boolean | undefined) ?? false
);
export const atomPersistenceIsAutoLaunch = atom(
  (get) => get(atomIsAutoLaunch),
  (_get, set, newBool: boolean) => {
    set(atomIsAutoLaunch, newBool);
    window.electron.preferences.set('isAutoLaunch', newBool);
  }
);

const atomIsAutoUpdate = atom<boolean>(
  (window.electron?.preferences.get('isAutoUpdate') as boolean | undefined) ?? false
);
export const atomPersistenceIsAutoUpdate = atom(
  (get) => get(atomIsAutoUpdate),
  (_get, set, newBool: boolean) => {
    set(atomIsAutoUpdate, newBool);
    window.electron.preferences.set('isAutoUpdate', newBool);
  }
);
