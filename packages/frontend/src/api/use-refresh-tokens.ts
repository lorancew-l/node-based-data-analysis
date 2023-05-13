import { useCallback } from 'react';
import { useFetch, UseFetch } from './use-fetch';
import { TokenResponse } from './types';

export const useRefreshTokens = (props?: UseFetch<TokenResponse>) => {
  const { fetchData } = useFetch(props);

  const refresh = useCallback(
    (refresh_token: string) =>
      fetchData('/api/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      }),
    [],
  );

  return {
    refresh,
  };
};
