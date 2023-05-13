import { useCallback } from 'react';
import { useGetProjectRequest } from '../../api';
import { exportToJson } from './utils';

export const useDownloadProject = () => {
  const { getProject } = useGetProjectRequest();

  const downloadProjectById = useCallback(async (id: string) => {
    const project = await getProject(id);

    exportToJson(project.data);
  }, []);

  return downloadProjectById;
};
