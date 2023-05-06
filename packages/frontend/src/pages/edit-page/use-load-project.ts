import { useEffect } from 'react';
import { useGetProjectRequest } from '../../api';
import { reset, useAppDispatch } from '../../store';
import { SavedAppState } from '../../types';
import { useReactFlow } from 'reactflow';
import { useNavigate } from 'react-router';
import { useUser } from '../../auth-context';

export const useLoadProject = (projectId: string) => {
  const { isLoading, getProject } = useGetProjectRequest();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const user = useUser();

  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    console.log('effect', projectId, user);
    if (!projectId) {
      return;
    }

    if (projectId && !user) {
      navigate('/signin');
      return;
    }

    (async () => {
      const { data } = await getProject(projectId);

      dispatch(reset(data));
      reactFlowInstance.setViewport(data.reactFlow.viewport);
    })();
  }, [projectId]);

  return { isLoading };
};
