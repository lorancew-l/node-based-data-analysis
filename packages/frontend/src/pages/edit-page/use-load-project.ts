import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { useNavigate } from 'react-router';
import { useGetProjectRequest } from '../../api';
import { reset, useAppDispatch } from '../../store';
import { setProject } from '../../store/reducers/project';
import { useAuthContext } from '../../auth-context';
import { useReadonlyContext } from './readonly-context';

export const useLoadProject = (projectId: string) => {
  const { getUser } = useAuthContext();
  const readonly = useReadonlyContext();

  const { isLoading, getProject } = useGetProjectRequest({
    onSuccess: (project) => {
      const { data } = project;
      const { id: userId } = getUser();

      if (project.userId !== userId && !readonly) {
        navigate('/403');
      }

      dispatch(reset(data));
      dispatch(setProject(project));
      reactFlowInstance.setViewport(data.reactFlow.viewport);
    },
    onError: (error) => {
      if (error === 403) {
        navigate('/403');
      }
    },
  });

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  return { isLoading };
};
