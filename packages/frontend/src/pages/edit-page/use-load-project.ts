import { useEffect } from 'react';
import { useGetProjectRequest } from '../../api';
import { reset, useAppDispatch } from '../../store';
import { useReactFlow } from 'reactflow';
import { setProject } from '../../store/reducers/project';

export const useLoadProject = (projectId: string) => {
  const { isLoading, getProject } = useGetProjectRequest();

  const dispatch = useAppDispatch();

  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    (async () => {
      const project = await getProject(projectId);
      const { data } = project;

      dispatch(reset(data));
      dispatch(setProject(project));
      reactFlowInstance.setViewport(data.reactFlow.viewport);
    })();
  }, [projectId]);

  return { isLoading };
};
