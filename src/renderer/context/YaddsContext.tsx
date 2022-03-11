import React, { createContext, useState } from 'react';

export interface DsmConnectListType {
  host: string;
  username: string;
  did: string;
  id: string;
}

interface CtxType {
  hasYaddsSidebarMarginTop: boolean;
  setHasYaddsSidebarMarginTop: (hasYaddsSidebarMarginTop: boolean) => void;

  hasYaddsDrawer: boolean;
  persistHasYaddsDrawer: (hasYaddsDrawer: boolean) => void;

  yaddsDrawerCategory: string;
  persistYaddsDrawerCategory: (yaddsDrawerCategory: string) => void;

  yaddsAppearance: string;
  persistYaddsAppearance: (yaddsAppearance: string) => void;

  yaddsI18nCode: string;
  persistYaddsI18nCode: (yaddsI18nCode: string) => void;

  isYaddsAutoLaunch: boolean;
  persistIsYaddsAutoLaunch: (isYaddsAutoLaunch: boolean) => void;

  isYaddsAutoUpdate: boolean;
  persistIsYaddsAutoUpdate: (isYaddsAutoUpdate: boolean) => void;

  dsmConnectList: DsmConnectListType[];
  persistDsmConnectList: (arr: DsmConnectListType[]) => void;

  dsmConnectIndex: number;
  persistDsmConnectIndex: (index: number) => void;
}

export const YaddsCtx = createContext<CtxType>({
  hasYaddsSidebarMarginTop: true,
  setHasYaddsSidebarMarginTop: () => {},

  hasYaddsDrawer: true,
  persistHasYaddsDrawer: () => {},

  yaddsDrawerCategory: '',
  persistYaddsDrawerCategory: () => null,

  yaddsAppearance: 'system',
  persistYaddsAppearance: () => null,

  yaddsI18nCode: 'en',
  persistYaddsI18nCode: () => null,

  isYaddsAutoLaunch: false,
  persistIsYaddsAutoLaunch: () => null,

  isYaddsAutoUpdate: false,
  persistIsYaddsAutoUpdate: () => null,

  dsmConnectList: [],
  persistDsmConnectList: () => null,

  dsmConnectIndex: 0,
  persistDsmConnectIndex: () => null,
});

export const YaddsProvider: React.FC = (props) => {
  const { children } = props;

  // ---------------------------------------------------------------------------

  const [hasYaddsSidebarMarginTopVal, setHasYaddsSidebarMarginTopVal] = useState(true);

  const [hasYaddsDrawerVal, setHasYaddsDrawerVal] = useState(
    (window.electron?.store.get('hasYaddsDrawer') as boolean) ?? true
  );

  const [yaddsDrawerCategoryVal, setYaddsDrawerCategoryVal] = useState<string>(
    (window.electron?.store.get('yaddsDrawerCategory') as string) ?? '/queueAll'
  );

  const [YaddsAppearanceVal, setYaddsAppearanceVal] = useState<string>(
    (window.electron?.store.get('yaddsAppearance') as string) ?? 'system'
  );

  const [yaddsI18nCodeVal, setYaddsI18nCodeVal] = useState<string>(
    (window.electron?.store.get('yaddsI18nCode') as string) ?? 'en'
  );

  const [isYaddsAutoLaunchVal, setIsYaddsAutoLaunchVal] = useState<boolean>(
    (window.electron?.store.get('isYaddsAutoLaunch') as boolean) ?? false
  );

  const [isYaddsAutoUpdateVal, setIsYaddsAutoUpdateVal] = useState<boolean>(
    (window.electron?.store.get('isYaddsAutoUpdate') as boolean) ?? true
  );

  // ---------------------------------------------------------------------------

  const [dsmConnectListVal, setDsmConnectListVal] = useState<DsmConnectListType[]>(
    (window.electron?.store.get('dsmConnectList') as DsmConnectListType[]) ?? []
  );

  const [dsmConnectIndexVal, setDsmConnectIndexVal] = useState<number>(
    (window.electron?.store.get('dsmConnectIndex') as number) ?? 0
  );

  // ---------------------------------------------------------------------------

  const ctxValue = {
    hasYaddsSidebarMarginTop: hasYaddsSidebarMarginTopVal,
    setHasYaddsSidebarMarginTop: (bool: boolean) => {
      setHasYaddsSidebarMarginTopVal(bool);
    },

    hasYaddsDrawer: hasYaddsDrawerVal,
    persistHasYaddsDrawer: (bool: boolean) => {
      setHasYaddsDrawerVal(bool);
      window.electron.store.set('hasYaddsDrawer', bool);
    },

    yaddsDrawerCategory: yaddsDrawerCategoryVal,
    persistYaddsDrawerCategory: (str: string) => {
      setYaddsDrawerCategoryVal(str);
      window.electron.store.set('yaddsDrawerCategory', str);
    },

    yaddsAppearance: YaddsAppearanceVal,
    persistYaddsAppearance: (str: string) => {
      setYaddsAppearanceVal(str);
      window.electron.store.set('yaddsAppearance', str);
    },

    yaddsI18nCode: yaddsI18nCodeVal,
    persistYaddsI18nCode: (code: string) => {
      setYaddsI18nCodeVal(code);
      window.electron.store.set('yaddsI18nCode', code);
    },

    isYaddsAutoLaunch: isYaddsAutoLaunchVal,
    persistIsYaddsAutoLaunch: (bool: boolean) => {
      setIsYaddsAutoLaunchVal(bool);
      window.electron.store.set('isYaddsAutoLaunch', bool);
    },

    isYaddsAutoUpdate: isYaddsAutoUpdateVal,
    persistIsYaddsAutoUpdate: (bool: boolean) => {
      setIsYaddsAutoUpdateVal(bool);
      window.electron.store.set('isYaddsAutoUpdate', bool);
    },

    // ---------------------------------------------------------------------------

    dsmConnectList: dsmConnectListVal,
    persistDsmConnectList: (arr: DsmConnectListType[]) => {
      setDsmConnectListVal(arr);
      window.electron.store.set('dsmConnectList', arr);
    },

    dsmConnectIndex: dsmConnectIndexVal,
    persistDsmConnectIndex: (index: number) => {
      setDsmConnectIndexVal(index);
      window.electron.store.set('dsmConnectIndex', index);
    },
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
