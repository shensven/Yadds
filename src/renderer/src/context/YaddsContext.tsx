import React, { createContext, useState } from 'react';

interface CtxType {
  hasYaddsDrawer: boolean;
  setHasYaddsDrawer: (hasDrawer: boolean) => void;

  yaddsDrawerCategory: string;
  setYaddsDrawerCategory: (select: string) => void;
}

export const YaddsCtx = createContext<CtxType>({
  hasYaddsDrawer: true,
  setHasYaddsDrawer: () => {},

  yaddsDrawerCategory: '',
  setYaddsDrawerCategory: () => null,
});

export const YaddsProvider: React.FC = (props) => {
  const { children } = props;

  const [hasYaddsDrawerVal, setHasYaddsDrawerVal] = useState(
    (window.electron.store.get('hasYaddsDrawer') as boolean) ?? true
  );

  const [yaddsDrawerCategoryVal, setYaddsDrawerCategoryVal] = useState<string>(
    (window.electron.store.get('yaddsDrawerCategory') as string) ?? '/queueAll'
  );

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
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
