import { useCallback } from 'react';
import { UseFetch } from './use-fetch';
import { useSearchProjectsRequest, SearchProjectResponse, SearchProjectQueryParams } from './use-search-projects-request';
import { useAuthContext } from '../auth-context';

export type SearchUserProjectQueryParams = {
  page: number;
  offset: number;
  search: string;
};

export const useSearchUserProjectsRequest = (props?: UseFetch<SearchProjectResponse>) => {
  const { searchProjects, ...rest } = useSearchProjectsRequest(props);

  const { getUser } = useAuthContext();

  const searchUserProjects = useCallback((query: SearchUserProjectQueryParams) => {
    const { id: userId } = getUser();

    const searchUserQuery: SearchProjectQueryParams = {
      ...query,
      user: userId,
      published: false,
    };

    return searchProjects(searchUserQuery);
  }, []);

  return {
    searchUserProjects,
    ...rest,
  };
};
