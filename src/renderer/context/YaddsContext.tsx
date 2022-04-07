import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

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

export interface CtxType {
  hasYaddsSidebarMarginTop: boolean;
  setHasYaddsSidebarMarginTop: Dispatch<SetStateAction<boolean>>;

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
  setTasks: Dispatch<SetStateAction<DSTasks[]>>;

  tasksStatus: { isLoading: boolean; retry: number };
  setTasksStatus: Dispatch<SetStateAction<{ isLoading: boolean; retry: number }>>;
}

export const YaddsCtx = createContext<CtxType>({
  hasYaddsSidebarMarginTop: true,
  setHasYaddsSidebarMarginTop: () => {},

  hasYaddsSidebar: true,
  persistHasYaddsSidebar: () => {},

  yaddsSidebarCategory: '',
  persistYaddsSidebarCategory: () => {},

  yaddsAppearance: 'system',
  persistYaddsAppearance: () => {},

  yaddsI18nCode: 'en',
  persistYaddsI18nCode: () => {},

  isYaddsAutoLaunch: false,
  persistIsYaddsAutoLaunch: () => {},

  isYaddsAutoUpdate: false,
  persistIsYaddsAutoUpdate: () => {},

  dsmConnectList: [],
  persistDsmConnectList: () => {},

  dsmConnectIndex: 0,
  persistDsmConnectIndex: () => {},

  tasks: [],
  setTasks: () => {},

  tasksStatus: { isLoading: true, retry: 0 },
  setTasksStatus: () => {},
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

  const [tasksStatusVal, setTasksStatusVal] = useState<{ isLoading: boolean; retry: number }>({
    isLoading: true,
    retry: 0,
  });

  // ---------------------------------------------------------------------------

  const ctxValue = {
    hasYaddsSidebarMarginTop: hasYaddsSidebarMarginTopVal,
    setHasYaddsSidebarMarginTop: setHasYaddsSidebarMarginTopVal,

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
    setTasks: setTasksVal,

    tasksStatus: tasksStatusVal,
    setTasksStatus: setTasksStatusVal,
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
