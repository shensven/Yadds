import React, { createContext, useState } from 'react';

interface CtxType {
  hasDrawer: boolean;
  setHasDrawer: (hasDrawer: boolean) => void;
  select: string;
  setSelect: (select: string) => void;
}

export const YaddsCtx = createContext<CtxType>({
  hasDrawer: true,
  setHasDrawer: () => {},
  select: '',
  setSelect: () => null,
});

export const YaddsProvider: React.FC = (props) => {
  const { children } = props;

  const [hasDrawerVal, setHasDrawerVal] = useState(true);
  const [selectVal, setSelectVal] = useState<string>('/queueAll');

  const ctxValue = {
    hasDrawer: hasDrawerVal,
    setHasDrawer: (bool: boolean) => setHasDrawerVal(bool),
    select: selectVal,
    setSelect: (str: string) => setSelectVal(str),
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
