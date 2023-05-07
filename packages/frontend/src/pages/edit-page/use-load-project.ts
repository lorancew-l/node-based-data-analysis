import { useEffect } from 'react';
import { useGetProjectRequest } from '../../api';
import { reset, useAppDispatch } from '../../store';
import { useReactFlow } from 'reactflow';
import { useLocation, useNavigate } from 'react-router';
import { useUser } from '../../auth-context';
import { setProject } from '../../store/reducers/project';

export const useLoadProject = (projectId: string) => {
  const { isLoading, getProject } = useGetProjectRequest();

  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const user = useUser();

  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (!projectId) {
      return;
    }

    if (projectId && !user) {
      navigate('/signin', { state: { redirectTo: location.pathname } });
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
