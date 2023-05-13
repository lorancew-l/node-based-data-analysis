import { useCallback } from 'react';
import { Project } from './types';
import { useFetch, UseFetch } from './use-fetch';

export const useRemoveProjectRequest = (props?: UseFetch<Project['id'][]>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const removeProject = useCallback(
    (projectIdList: Project['id'][]) =>
      fetchData('/api/project/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectIdList }),
      }),
    [],
  );

  return {
    removeProject,
    ...rest,
  };
};
