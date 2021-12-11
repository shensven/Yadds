import React, { createContext, useState } from 'react';

interface CtxType {
  hasDrawer: boolean;
  setHasDrawer: (hasDrawer: boolean) => void;
  select: number;
  setSelect: (select: number) => void;
}

export const YaddsCtx = createContext<CtxType>({
  hasDrawer: true,
  setHasDrawer: () => {},
  select: 0,
  setSelect: () => null,
});

export const YaddsProvider: React.FC = (props) => {
  const { children } = props;

  const [hasDrawerVal, setHasDrawerVal] = useState(true);
  const [selectVal, setSelectVal] = useState<number>(0);

  const ctxValue = {
    hasDrawer: hasDrawerVal,
    setHasDrawer: (bool: boolean) => setHasDrawerVal(bool),
    select: selectVal,
    setSelect: (num: number) => setSelectVal(num),
  };

  return <YaddsCtx.Provider value={ctxValue}>{children}</YaddsCtx.Provider>;
};
