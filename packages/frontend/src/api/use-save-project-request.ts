import { useCallback } from 'react';
import { Project } from './types';
import { useFetch, UseFetch } from './use-fetch';

export const useSaveProjectRequest = (props?: UseFetch<Project>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const saveProject = useCallback((project: Project) => {
    fetchData('/api/project/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
  }, []);

  return {
    saveProject,
    ...rest,
  };
};
