import { useCallback } from 'react';
import { useFetch, UseFetch } from './use-fetch';
import { User } from './types';

export const useGetUsersRequest = (props?: UseFetch<User[]>) => {
  const { fetchData, data, ...rest } = useFetch<User[]>({ ...props, withAuth: true });

  const getUsers = useCallback(() => fetchData(`/api/user/user-list`), []);

  return {
    getUsers,
    users: data,
    ...rest,
  };
};
