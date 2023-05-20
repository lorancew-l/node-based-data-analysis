import { useCallback } from 'react';
import { Project } from './types';
import { useFetch, UseFetch } from './use-fetch';

export const useSaveProjectRequest = (props?: UseFetch<Project>) => {
  const { fetchData, ...rest } = useFetch({ ...props, withAuth: true });

  const saveProject = useCallback(
    (project: Omit<Project, 'id'>) => {
      return fetchData('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
    },

    [],
  );

  const updateProject = useCallback(
    (projectId: string, project: Partial<Omit<Project, 'id'>>) => {
      return fetchData(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });
    },

    [],
  );

  return {
    updateProject,
    saveProject,
    ...rest,
  };
};
