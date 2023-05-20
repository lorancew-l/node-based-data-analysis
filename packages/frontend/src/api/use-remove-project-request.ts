import { useCallback } from 'react';
import { Project } from './types';
import { useFetch, UseFetch } from './use-fetch';

export const useRemoveProjectRequest = (props?: UseFetch<Project['id'][]>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const removeProject = useCallback((projectIdList: Project['id'][]) => {
    return fetchData(`/api/projects/${projectIdList.join(',')}`, {
      method: 'DELETE',
    });
  }, []);

  return {
    removeProject,
    ...rest,
  };
};
