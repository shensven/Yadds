import React, { createContext, useState } from 'react';

interface CtxType {
  hasYaddsDrawer: boolean;
  setHasYaddsDrawer: (hasDrawer: boolean) => void;

  select: string;
  setSelect: (select: string) => void;
}

export const YaddsCtx = createContext<CtxType>({
  hasYaddsDrawer: true,
  setHasYaddsDrawer: () => {},

  select: '',
  setSelect: () => null,
});

export const YaddsProvider: React.FC = (props) => {
  const { children } = props;

  const [hasYaddsDrawerVal, setHasYaddsDrawerVal] = useState(
    (window.electron.store.get('hasYaddsDrawer') as boolean) ?? true
  );

  const [selectVal, setSelectVal] = useState<string>('/queueAll');

  const ctxValue = {
    hasYaddsDrawer: hasYaddsDrawerVal,
    setHasYaddsDrawer: (bool: boolean) => {
      setHasYaddsDrawerVal(bool);
      window.electron.store.set('hasYaddsDrawer', bool);
    },

    select: selectVal,
    setSelect: (str: string) => setSelectVal(str),
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
