import React, { createContext, useState } from 'react';

interface CtxType {
  hasYaddsDrawer: boolean;
  setHasYaddsDrawer: (hasYaddsDrawer: boolean) => void;

  yaddsDrawerCategory: string;
  setYaddsDrawerCategory: (yaddsDrawerCategory: string) => void;

  yaddsAppearanceIndex: number;
  setYaddsAppearanceIndex: (yaddsAppearanceIndex: number) => void;

  yaddsI18nCode: string;
  setYaddsI18nCode: (yaddsI18nCode: string) => void;

  isYaddsAutoLaunch: boolean;
  setIsYaddsAutoLaunch: (isYaddsAutoLaunch: boolean) => void;

  isYaddsAutoUpdate: boolean;
  setIsYaddsAutoUpdate: (isYaddsAutoUpdate: boolean) => void;
}

export const YaddsCtx = createContext<CtxType>({
  hasYaddsDrawer: true,
  setHasYaddsDrawer: () => {},

  yaddsDrawerCategory: '',
  setYaddsDrawerCategory: () => null,

  yaddsAppearanceIndex: 0,
  setYaddsAppearanceIndex: () => null,

  yaddsI18nCode: 'en',
  setYaddsI18nCode: () => null,

  isYaddsAutoLaunch: false,
  setIsYaddsAutoLaunch: () => null,

  isYaddsAutoUpdate: false,
  setIsYaddsAutoUpdate: () => null,
});

export const YaddsProvider: React.FC = (props) => {
  const { children } = props;

  // ---------------------------------------------------------------------------

  const [hasYaddsDrawerVal, setHasYaddsDrawerVal] = useState(
    (window.electron?.store.get('hasYaddsDrawer') as boolean) ?? true
  );

  const [yaddsDrawerCategoryVal, setYaddsDrawerCategoryVal] = useState<string>(
    (window.electron?.store.get('yaddsDrawerCategory') as string) ?? '/queueAll'
  );

  const [YaddsAppearanceIndexVal, setYaddsAppearanceIndexVal] = useState<number>(
    (window.electron?.store.get('yaddsAppearanceIndex') as number) ?? 0
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

  const ctxValue = {
    hasYaddsDrawer: hasYaddsDrawerVal,
    setHasYaddsDrawer: (bool: boolean) => {
      setHasYaddsDrawerVal(bool);
      window.electron.store.set('hasYaddsDrawer', bool);
    },

    yaddsDrawerCategory: yaddsDrawerCategoryVal,
    setYaddsDrawerCategory: (str: string) => {
      setYaddsDrawerCategoryVal(str);
      window.electron.store.set('yaddsDrawerCategory', str);
    },

    yaddsAppearanceIndex: YaddsAppearanceIndexVal,
    setYaddsAppearanceIndex: (index: number) => {
      setYaddsAppearanceIndexVal(index);
      window.electron.store.set('yaddsAppearanceIndex', index);
    },

    yaddsI18nCode: yaddsI18nCodeVal,
    setYaddsI18nCode: (code: string) => {
      setYaddsI18nCodeVal(code);
      window.electron.store.set('yaddsI18nCode', code);
    },

    isYaddsAutoLaunch: isYaddsAutoLaunchVal,
    setIsYaddsAutoLaunch: (bool: boolean) => {
      setIsYaddsAutoLaunchVal(bool);
      window.electron.store.set('isYaddsAutoLaunch', bool);
    },

    isYaddsAutoUpdate: isYaddsAutoUpdateVal,
    setIsYaddsAutoUpdate: (bool: boolean) => {
      setIsYaddsAutoUpdateVal(bool);
      window.electron.store.set('isYaddsAutoUpdate', bool);
    },
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
