import { useCallback } from 'react';
import { Project } from './types';
import { useFetch, UseFetch } from './use-fetch';

export const useCloneProjectRequest = (props?: UseFetch<Project>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const cloneProject = useCallback(
    (projectId: Project['id']) =>
      fetchData('/api/project/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      }),
    [],
  );

  return {
    cloneProject,
    ...rest,
  };
};
