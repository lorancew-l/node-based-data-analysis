import { useCallback } from 'react';
import { TokenResponse } from '../api';

export const useStorageAuth = (key: string) => {
  const getTokenFromStorage = useCallback((): TokenResponse | null => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }, [key]);

  const setTokenToStorage = useCallback(
    (tokens: TokenResponse) => {
      localStorage.setItem(key, JSON.stringify(tokens));
    },
    [key],
  );

  const removeTokenFromStorage = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { getTokenFromStorage, setTokenToStorage, removeTokenFromStorage };
};
