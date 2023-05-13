import { useState, useCallback, useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProjectListItem, useSearchUserProjectsRequest, useCloneProjectRequest, useRemoveProjectRequest } from '../../api';

export const useUserProjectList = () => {
  const [count, setCount] = useState(0);
  const [projectList, setProjectList] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const ignoreParamChange = useRef(false);

  const queryString = useRef('');
  queryString.current = searchParams.toString();

  const setSearchParam = useCallback((key: 'page' | 'offset' | 'search', value: string | number) => {
    const updatedSearchParams = new URLSearchParams(queryString.current);

    if (value) {
      updatedSearchParams.set(key, `${value}`);
    } else {
      updatedSearchParams.delete(key);
    }

    setSearchParams(updatedSearchParams.toString());
  }, []);

  const refreshTable = useCallback(() => {
    const searchParams = new URLSearchParams(queryString.current);

    const offset = Number(searchParams.get('offset')) || 20;
    const search = searchParams.get('search') || '';

    return searchUserProjects({ page: 1, offset, search });
  }, []);

  const page = Number(searchParams.get('page')) || 1;
  const offset = Number(searchParams.get('offset')) || 20;
  const search = searchParams.get('search') || '';

  const { searchUserProjects } = useSearchUserProjectsRequest({
    onSuccess: ({ count, items }) => {
      setProjectList(items);
      setCount(count);
    },
  });

  const { cloneProject } = useCloneProjectRequest();

  const { removeProject } = useRemoveProjectRequest();

  useLayoutEffect(() => {
    if (ignoreParamChange.current) {
      ignoreParamChange.current = false;
      return;
    }

    searchUserProjects({ page, offset, search });
  }, [page, offset, search]);

  const operationWithTableRefresh =
    <R, A extends unknown[]>(operation: (...args: A) => Promise<R>) =>
    async (...args: A) => {
      setIsLoading(true);

      await operation(...args);
      await refreshTable();

      ignoreParamChange.current = true;
      setSearchParam('page', 1);
      setIsLoading(false);
    };

  const cloneProjectAndRefresh = useCallback(operationWithTableRefresh(cloneProject), []);

  const removeProjectAndRefresh = useCallback(operationWithTableRefresh(removeProject), []);

  return {
    count,
    isLoading,
    projectList,
    page,
    offset,
    search,
    cloneProject: cloneProjectAndRefresh,
    removeProject: removeProjectAndRefresh,
    changeFilter: setSearchParam,
  };
};
