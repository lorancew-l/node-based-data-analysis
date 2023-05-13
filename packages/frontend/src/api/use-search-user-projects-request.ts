import { useCallback } from 'react';
import { ProjectListItem } from './types';
import { useFetch, UseFetch } from './use-fetch';

export type SearchUserProjectQueryParams = {
  page: number;
  offset: number;
  search: string;
};

type SearchUserProjectResponse = {
  count: number;
  page: number;
  offset: number;
  items: ProjectListItem[];
};

export const useSearchUserProjectsRequest = (props?: UseFetch<SearchUserProjectResponse>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const searchUserProjects = useCallback((query: SearchUserProjectQueryParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => searchParams.set(key, String(value)));

    return fetchData(`/api/project/user-projects?${searchParams.toString()}`);
  }, []);

  return {
    searchUserProjects,
    ...rest,
  };
};
