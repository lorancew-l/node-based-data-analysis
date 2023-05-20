import { useCallback } from 'react';
import { ProjectListItem } from './types';
import { useFetch, UseFetch } from './use-fetch';

export type SearchProjectQueryParams = {
  page: number;
  offset: number;
  search: string;
  user?: string;
  published?: boolean;
};

export type SearchProjectResponse = {
  count: number;
  page: number;
  offset: number;
  items: ProjectListItem[];
};

export const useSearchProjectsRequest = (props?: UseFetch<SearchProjectResponse>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const searchProjects = useCallback((query: SearchProjectQueryParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => searchParams.set(key, String(value)));

    return fetchData(`/api/projects?${searchParams.toString()}`);
  }, []);

  return {
    searchProjects,
    ...rest,
  };
};
