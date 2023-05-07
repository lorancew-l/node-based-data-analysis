import React, { createContext, useContext } from 'react';

const readonlyContext = createContext<boolean>(true);

export const useReadonlyContext = () => useContext(readonlyContext);

type ReadonlyContextProviderProps = {
  readonly: boolean;
  children: React.ReactElement;
};

export const ReadonlyContextProvider: React.FC<ReadonlyContextProviderProps> = ({ readonly, children }) => {
  return <readonlyContext.Provider value={readonly}>{children}</readonlyContext.Provider>;
};
