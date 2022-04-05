import React, { createContext, useState } from 'react';

export interface DsmConnectListType {
  host: string;
  port: number;
  quickConnectID: string;
  username: string;
  did: string;
  sid: string;
}

export interface DSTasks {
  id: string;
  size: number;
  status: string;
  title: string;
  type: string;
  username?: string;
  additional?: {
    seconds_left: number;
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
  };
}

interface CtxType {
  hasYaddsSidebarMarginTop: boolean;
  setHasYaddsSidebarMarginTop: (hasYaddsSidebarMarginTop: boolean) => void;

  hasYaddsSidebar: boolean;
  persistHasYaddsSidebar: (hasYaddsSidebar: boolean) => void;

  yaddsSidebarCategory: string;
  persistYaddsSidebarCategory: (yaddsSidebarCategory: string) => void;

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

  tasks: DSTasks[];
  setTasks: (tasks: DSTasks[]) => void;
}

export const YaddsCtx = createContext<CtxType>({
  hasYaddsSidebarMarginTop: true,
  setHasYaddsSidebarMarginTop: () => {},

  hasYaddsSidebar: true,
  persistHasYaddsSidebar: () => {},

  yaddsSidebarCategory: '',
  persistYaddsSidebarCategory: () => null,

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

  tasks: [],
  setTasks: () => null,
});

export const YaddsProvider: React.FC = (props) => {
  const { children } = props;

  // ---------------------------------------------------------------------------

  const [hasYaddsSidebarMarginTopVal, setHasYaddsSidebarMarginTopVal] = useState(true);

  const [hasYaddsSidebarVal, setHasYaddsSidebarVal] = useState(
    (window.electron?.store.get('hasYaddsSidebar') as boolean) ?? true
  );

  const [yaddsSidebarCategoryVal, setYaddsSidebarCategoryVal] = useState<string>(
    (window.electron?.store.get('yaddsSidebarCategory') as string) ?? '/queueAll'
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

  const [tasksVal, setTasksVal] = useState<DSTasks[]>([]);

  // ---------------------------------------------------------------------------

  const ctxValue = {
    hasYaddsSidebarMarginTop: hasYaddsSidebarMarginTopVal,
    setHasYaddsSidebarMarginTop: (bool: boolean) => {
      setHasYaddsSidebarMarginTopVal(bool);
    },

    hasYaddsSidebar: hasYaddsSidebarVal,
    persistHasYaddsSidebar: (bool: boolean) => {
      setHasYaddsSidebarVal(bool);
      window.electron.store.set('hasYaddsSidebar', bool);
    },

    yaddsSidebarCategory: yaddsSidebarCategoryVal,
    persistYaddsSidebarCategory: (str: string) => {
      setYaddsSidebarCategoryVal(str);
      window.electron.store.set('yaddsSidebarCategory', str);
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

    // ---------------------------------------------------------------------------

    tasks: tasksVal,
    setTasks: (tasks: DSTasks[]) => {
      setTasksVal(tasks);
    },
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
