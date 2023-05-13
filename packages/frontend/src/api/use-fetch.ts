import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuthContext } from '../auth-context';

export type UseFetch<T> = {
  withAuth?: boolean;
  onSuccess?(result: T): void;
  onError?(status: any): void;
};

export const useFetch = <T>({ onSuccess, onError, withAuth = false }: UseFetch<T> = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<T>(null);

  const isTriedRefresh = useRef(false);

  const abortController = useRef<AbortController>(null);

  const { getToken, refreshTokens } = useAuthContext();

  const fetchData = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      let data: T;

      const controller = new AbortController();

      try {
        setIsLoading(true);

        if (abortController.current) {
          abortController.current.abort();
        }

        abortController.current = controller;

        let token = withAuth ? await getToken() : null;

        const getFetchQuery = () =>
          fetch(input, {
            ...init,
            ...(withAuth && {
              headers: {
                ...init?.headers,
                Authorization: `Bearer ${token}`,
              },
              signal: abortController.current.signal,
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
        abortController.current = null;

        data = await response.json();

        onSuccess?.(data);
        setData(data);
      } catch (error) {
        abortController.current = null;
        onError?.(error);
        setError(error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }

      return data;
    },
    [onSuccess, onError],
  );

  useEffect(() => {
    return () => abortController.current?.abort();
  }, []);

  return { isLoading, isError: !!error, error, data, fetchData };
};
