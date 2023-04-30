import React, { createContext, RefObject, useContext, useRef } from 'react';

export type RendererContextValue = RefObject<HTMLDivElement>;

const rendererContext = createContext<RendererContextValue>(null);

export const useRendererContext = () => useContext(rendererContext);

type RendererContextProviderProps = {
  children: React.ReactElement;
};

export const RendererContextProvider: React.FC<RendererContextProviderProps> = ({ children }) => {
  const rendererRef = useRef<HTMLDivElement>();

  return <rendererContext.Provider value={rendererRef}>{children}</rendererContext.Provider>;
};
