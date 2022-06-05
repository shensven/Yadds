import { atom } from 'jotai';

export const atomHasSidebarMarginTop = atom<boolean>(true);

// -----------------------------------------------------------------------------

const atomHasSidebar = atom<boolean>((window.electron?.store.get('hasYaddsSidebar') as boolean | undefined) ?? true);
export const atomPersistenceHasSidebar = atom(
  (get) => get(atomHasSidebar),
  (_get, set, newBool: boolean) => {
    set(atomHasSidebar, newBool);
    window.electron.store.set('hasYaddsSidebar', newBool);
  }
);

// -----------------------------------------------------------------------------

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
  (window.electron?.store.get('yaddsSidebarCategory') as SidebarCategory | undefined) ?? '/queueAll'
);
export const atomPersistenceSidebarCategory = atom(
  (get) => get(atomSidebarCategory),
  (_get, set, newStr: SidebarCategory) => {
    set(atomSidebarCategory, newStr);
    window.electron.store.set('yaddsSidebarCategory', newStr);
  }
);

// -----------------------------------------------------------------------------

export type Appearance = 'light' | 'dark' | 'system';

const atomAppearance = atom<Appearance>(
  (window.electron?.store.get('yaddsAppearance') as Appearance | undefined) ?? 'system'
);
export const atomPersistenceAppearance = atom(
  (get) => get(atomAppearance),
  (_get, set, newStr: Appearance) => {
    set(atomAppearance, newStr);
    window.electron.store.set('yaddsAppearance', newStr);
  }
);

// -----------------------------------------------------------------------------

export type LocaleName = 'en' | 'zh_CN' | 'zh_TW' | 'ja_JP';

const atomLocaleName = atom<LocaleName>(
  (window.electron?.store.get('yaddsI18nCode') as LocaleName | undefined) ?? 'en'
);
export const atomPersistenceLocaleName = atom(
  (get) => get(atomLocaleName),
  (_get, set, newStr: LocaleName) => {
    set(atomLocaleName, newStr);
    window.electron.store.set('yaddsI18nCode', newStr);
  }
);

// -----------------------------------------------------------------------------

const atomIsAutoLaunch = atom<boolean>(
  (window.electron?.store.get('isYaddsAutoLaunch') as boolean | undefined) ?? false
);
export const atomPersistenceIsAutoLaunch = atom(
  (get) => get(atomIsAutoLaunch),
  (_get, set, newBool: boolean) => {
    set(atomIsAutoLaunch, newBool);
    window.electron.store.set('isYaddsAutoLaunch', newBool);
  }
);

// -----------------------------------------------------------------------------

const atomIsAutoUpdate = atom<boolean>(
  (window.electron?.store.get('isYaddsAutoUpdate') as boolean | undefined) ?? true
);
export const atomPersistenceIsAutoUpdate = atom(
  (get) => get(atomIsAutoUpdate),
  (_get, set, newBool: boolean) => {
    set(atomIsAutoUpdate, newBool);
    window.electron.store.set('isYaddsAutoUpdate', newBool);
  }
);

// -----------------------------------------------------------------------------

const atomQueueIterater = atom<string>(
  (window.electron?.store.get('yaddsMainOrderIterater') as string | undefined) ?? 'date'
);
export const atomPersistenceQueueIterater = atom(
  (get) => get(atomQueueIterater),
  (_get, set, newStr: string) => {
    set(atomQueueIterater, newStr);
    window.electron.store.set('yaddsMainOrderIterater', newStr);
  }
);

// -----------------------------------------------------------------------------

const atomQueueIsAscend = atom<boolean>(
  (window.electron?.store.get('yaddsMainOrderIsAscend') as boolean | undefined) ?? true
);
export const atomPersistenceQueueIsAscend = atom(
  (get) => get(atomQueueIsAscend),
  (_get, set, newBool: boolean) => {
    set(atomQueueIsAscend, newBool);
    window.electron.store.set('yaddsMainOrderIsAscend', newBool);
  }
);
