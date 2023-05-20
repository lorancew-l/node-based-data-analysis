import { useCallback } from 'react';
import { Project } from './types';
import { useFetch, UseFetch } from './use-fetch';

export const useCloneProjectRequest = (props?: UseFetch<Project>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const cloneProject = useCallback(
    (projectId: Project['id']) =>
      fetchData(`/api/projects?sourceId=${projectId}`, {
        method: 'POST',
      }),
    [],
  );

  return {
    cloneProject,
    ...rest,
  };
};
