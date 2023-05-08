import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link as RRLink } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Link,
  CircularProgress,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { makeStyles } from 'tss-react/mui';
import { visuallyHidden } from '@mui/utils';
import { useSearchProjectsRequest } from '../../api/use-search-projects-request';
import { ProjectListItem } from '../../api';
import { Pagination } from './pagination';

const useStyles = makeStyles()((theme) => ({
  tableContainer: {
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    left: '50%',
    top: '40%',
    transform: 'translate(-50%,-50%)',
  },
  row: {
    position: 'relative',
  },
  moreIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: theme.spacing(1),
    top: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
  },
}));

type LimitedTextProps = {
  text: string;
  charCount: number;
};

const LimitedText: React.FC<LimitedTextProps> = ({ text, charCount }) => {
  const limitedText = text.length > charCount ? text.slice(0, charCount) + '...' : text;

  if (limitedText.length === text.length) {
    return <span>{text}</span>;
  }

  return (
    <Tooltip title={text}>
      <span>{limitedText}</span>
    </Tooltip>
  );
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof ProjectListItem;
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    label: 'Заголовок',
  },
  { id: 'description', label: 'Описание' },
  {
    id: 'user',
    label: 'Пользователь',
  },
  {
    id: 'created_at',
    label: 'Дата создания',
  },
  {
    id: 'updated_at',
    label: 'Дата обновления',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ProjectListItem) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

const EnhancedTableHead: React.FC<EnhancedTableProps> = ({ order, orderBy, rowCount, onRequestSort }) => {
  const createSortHandler = (property: keyof ProjectListItem) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>

        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left" padding="none" sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

type EnhancedTableToolbarProps = {};

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({}) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Tooltip title="Filter list">
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

export const ProjectListTable: React.FC = () => {
  const { classes } = useStyles();

  const [rows, setRows] = useState<ProjectListItem[]>([]);

  const [count, setCount] = useState<number>(0);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ProjectListItem>('title');

  const [searchParams, setSearchParams] = useSearchParams({ page: '1', offset: '20' });

  const page = Number(searchParams.get('page')) || 1;
  const offset = Number(searchParams.get('offset')) || 20;

  const { searchProjects, isLoading } = useSearchProjectsRequest({
    onSuccess: ({ count, items }) => {
      setRows(items);
      setCount(count);
    },
  });

  useEffect(() => {
    searchProjects({ page, offset });
  }, [page, offset]);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ProjectListItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prevSearchParams) => ({ ...prevSearchParams, page }));
  };

  const handleRowsPerPageChange = (offset: number) => {
    setSearchParams((prevSearchParams) => ({ ...prevSearchParams, offset }));
  };

  const emptyRows = offset - rows.length;

  const sortedRows = useMemo(() => rows.slice().sort(getComparator(order, orderBy)), [order, orderBy, rows]);

  return (
    <Box sx={{ width: '100%' }} className={classes.tableContainer}>
      <Paper sx={{ width: '100%' }}>
        <EnhancedTableToolbar />

        {isLoading && <CircularProgress className={classes.loader} />}

        <TableContainer style={{ maxHeight: 'calc(100vh - 116px)' }}>
          <Table size="medium" stickyHeader>
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={sortedRows.length} />

            <TableBody>
              {sortedRows.map((row) => {
                return (
                  <TableRow className={classes.row} role="checkbox" tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }} hover>
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" />
                    </TableCell>

                    <TableCell component="th" scope="row" padding="none">
                      <Link component={RRLink} to={`/view/${row.id}`} variant="body2">
                        {row.title}
                      </Link>
                    </TableCell>

                    <TableCell component="th" scope="row" padding="none">
                      <LimitedText text={row.description} charCount={50} />
                    </TableCell>

                    <TableCell component="th" scope="row" padding="none">
                      {`${row.user.firstName} ${row.user.lastName}`}
                    </TableCell>

                    <TableCell component="th" scope="row" padding="none">
                      {new Date(row.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell component="th" scope="row" padding="none">
                      {new Date(row.updated_at).toLocaleDateString()}
                    </TableCell>

                    <span className={classes.moreIcon}>
                      <MoreHorizIcon />
                    </span>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Pagination
          totalCount={count}
          page={page}
          pageCount={sortedRows.length}
          offset={offset}
          onPageChange={handlePageChange}
          onOffsetChange={handleRowsPerPageChange}
          offsetOptions={[20, 50, 100]}
        />
      </Paper>
    </Box>
  );
};
