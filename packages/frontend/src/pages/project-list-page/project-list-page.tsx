import { useState, useCallback, useLayoutEffect, useRef } from 'react';
import { IconButton, Collapse, Paper, Link } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSearchParams, Link as RRLink } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { ProjectListTable } from './project-list-table';
import { Account, TopBar, SearchField } from '../../components';
import { UserAutocompleteField } from './user-autocomplete-field';
import { ProjectListItem, useSearchProjectsRequest } from '../../api';

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
  slideBar: {
    width: '100%',
    position: 'absolute',
    zIndex: theme.zIndex.modal,
    top: 'calc(100% + 1px)',
    left: 0,
  },
  bar: {
    width: '100%',
  },
  filterList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 2),
    borderRadius: 0,
    '&&&': {
      backgroundImage: 'none',
      backgroundColor: theme.palette.background.default,
    },
  },
  button: {
    height: 40,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginRight: 'auto',
  },
}));

export const ProjectListPage = () => {
  const { classes } = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState<ProjectListItem[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const queryString = useRef('');
  queryString.current = searchParams.toString();

  const setSearchParam = useCallback((key: string, value: string | number) => {
    const updatedSearchParams = new URLSearchParams(queryString.current);

    if (value) {
      updatedSearchParams.set(key, `${value}`);
    } else {
      updatedSearchParams.delete(key);
    }

    setSearchParams(updatedSearchParams.toString());
  }, []);

  const page = Number(searchParams.get('page')) || 1;
  const offset = Number(searchParams.get('offset')) || 20;
  const search = searchParams.get('search') || '';
  const user = searchParams.get('user') || '';

  const { searchProjects, isLoading } = useSearchProjectsRequest({
    onSuccess: ({ count, items }) => {
      setRows(items);
      setCount(count);
    },
  });

  useLayoutEffect(() => {
    searchProjects({ page, offset, search, user });
  }, [page, offset, search, user]);

  const handleUserChange = useCallback((userId: string) => setSearchParam('user', userId), []);

  const handlePageChange = useCallback((page: number) => setSearchParam('page', page), []);

  const handleOffsetChange = useCallback((offset: number) => setSearchParam('offset', offset), []);

  const handleSearchChange = useCallback((search: string) => setSearchParam('search', search), []);

  const handleFilterButtonClick = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  const topBarRef = useRef<HTMLDivElement>();
  const [topBarHeight, setTopBarHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = topBarRef.current.getBoundingClientRect();

    setTopBarHeight(height);
  }, []);

  return (
    <section style={{ height: `calc(100vh - ${topBarHeight}px)` }} className={classes.container}>
      <TopBar className={classes.topBar} ref={topBarRef}>
        <nav className={classes.nav}>
          <Link component={RRLink} to={'/edit'} variant="body2">
            Создать проект
          </Link>

          <Link component={RRLink} to={'/my-projects'} variant="body2">
            Мои проекты
          </Link>
        </nav>

        <IconButton onClick={handleFilterButtonClick}>
          <FilterListIcon fontSize="medium" />
        </IconButton>

        <div className={classes.slideBar}>
          <Collapse in={isOpen}>
            <Paper elevation={5} className={classes.filterList}>
              <UserAutocompleteField value={user} onChange={handleUserChange} />
            </Paper>
          </Collapse>
        </div>

        <SearchField defaultValue={search} onChange={handleSearchChange} className={classes.searchField} />

        <Account />
      </TopBar>

      <ProjectListTable
        rows={rows}
        page={page}
        offset={offset}
        count={count}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onOffsetChange={handleOffsetChange}
      />
    </section>
  );
};
