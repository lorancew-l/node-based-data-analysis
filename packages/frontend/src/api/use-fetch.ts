import { useState, useCallback, useRef } from 'react';
import { useAuthContext } from '../auth-context';

export type UseFetch<T> = {
  withAuth?: boolean;
  onSuccess?(result: T): void;
  onError?(status: any): void;
};

export const useFetch = <T>({ onSuccess, onError, withAuth = false }: UseFetch<T> = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const isTriedRefresh = useRef(false);

  const { getToken, refreshTokens } = useAuthContext();

  const fetchData = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      let data: T;

      try {
        setIsLoading(true);

        let token = withAuth ? await getToken() : null;

        const getFetchQuery = () =>
          fetch(input, {
            ...init,
            ...(withAuth && {
              headers: {
                ...init?.headers,
                Authorization: `Bearer ${token}`,
              },
            }),
          });

        let response = await getFetchQuery();

        if (withAuth && !isTriedRefresh.current && response.status === 401) {
          isTriedRefresh.current = true;
          token = await refreshTokens();
          response = await getFetchQuery();
        }

        if (!response.ok) {
          onError?.(response.status);
          return;
        }

        isTriedRefresh.current = false;
        data = await response.json();

        onSuccess?.(data);
        setData(data);
      } catch (error) {
        console.log('error', error);
        onError?.(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }

      return data;
    },
    [onSuccess, onError],
  );

  return { isLoading, isError: !!error, error, data, fetchData };
};
