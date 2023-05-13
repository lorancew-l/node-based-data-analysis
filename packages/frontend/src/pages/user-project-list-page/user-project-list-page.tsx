import { useState, useCallback, useLayoutEffect, useRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { UserProjectListTable } from './user-project-list-table';
import { Account, TopBar, SearchField } from '../../components';
import { useUserProjectList } from './use-user-project-list';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100vw',
    margin: '0 auto',
  },
  topBar: {
    position: 'relative',
    justifyContent: 'flex-end',
  },
  searchField: {
    margin: theme.spacing(0, 1.5),
  },
}));

export const UserProjectListPage = () => {
  const { classes } = useStyles();

  const { isLoading, count, projectList, changeFilter, offset, page, search, cloneProject, removeProject } = useUserProjectList();

  const handlePageChange = useCallback((page: number) => changeFilter('page', page), []);

  const handleOffsetChange = useCallback((offset: number) => changeFilter('offset', offset), []);

  const handleSearchChange = useCallback((search: string) => changeFilter('search', search), []);

  const topBarRef = useRef<HTMLDivElement>();
  const [topBarHeight, setTopBarHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = topBarRef.current.getBoundingClientRect();

    setTopBarHeight(height);
  }, []);

  return (
    <section style={{ height: `calc(100vh - ${topBarHeight}px)` }} className={classes.container}>
      <TopBar className={classes.topBar} ref={topBarRef}>
        <SearchField defaultValue={search} onChange={handleSearchChange} className={classes.searchField} />

        <Account />
      </TopBar>

      <UserProjectListTable
        isLoading={isLoading}
        rows={projectList}
        page={page}
        offset={offset}
        count={count}
        onCloneProject={cloneProject}
        onRemoveProject={removeProject}
        onPageChange={handlePageChange}
        onOffsetChange={handleOffsetChange}
      />
    </section>
  );
};
