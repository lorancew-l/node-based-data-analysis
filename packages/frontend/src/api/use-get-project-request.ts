import { useCallback } from 'react';
import { Project } from './types';
import { useFetch, UseFetch } from './use-fetch';

export const useGetProjectRequest = (props?: UseFetch<Project>) => {
  const { fetchData, ...rest } = useFetch<Required<Project>>({ ...props, withAuth: true });

  const getProject = useCallback((projectId: Project['id']) => fetchData(`/api/projects/${projectId}`), []);

  return {
    getProject,
    ...rest,
  };
};
