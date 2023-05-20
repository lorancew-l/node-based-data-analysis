import { useMemo, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RRLink } from 'react-router-dom';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Link, CircularProgress } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { makeStyles } from 'tss-react/mui';
import { ProjectListItem, User, useCloneProjectRequest } from '../../api';
import { useDownloadProject } from '../edit-page/use-download-project';
import { TableHead, HeadCell, RowActionsTooltip, Pagination } from '../../components';
import { orderBy as orderRowsBy } from 'lodash';

const useStyles = makeStyles()((theme) => ({
  tableContainer: {
    height: '100%',
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
  table: {
    backgroundColor: theme.palette.background.default,
  },
  hiddenBody: {
    visibility: 'hidden',
  },
  cell: {
    height: 43,
    '&:first-child': {
      paddingLeft: theme.spacing(2),
    },
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

type Order = 'asc' | 'desc';

const headCells: HeadCell<keyof ProjectListItem>[] = [
  {
    id: 'title',
    label: 'Заголовок',
    getSortable: (value: string) => value,
  },
  {
    id: 'description',
    label: 'Описание',
    getSortable: (value: string) => value,
  },
  {
    id: 'user',
    label: 'Пользователь',
    getSortable: (user: User) => `${user.firstName} ${user.lastName}`,
  },
  {
    id: 'created_at',
    label: 'Дата создания',
    getSortable: (value: string) => value,
  },
  {
    id: 'updated_at',
    label: 'Дата обновления',
    getSortable: (value: string) => value,
  },
];

type ProjectListTableProps = {
  rows: ProjectListItem[];
  count: number;
  page: number;
  offset: number;
  isLoading: boolean;
  onPageChange(page: number): void;
  onOffsetChange(offset: number): void;
};

export const ProjectListTable: React.FC<ProjectListTableProps> = ({
  rows,
  count,
  page,
  offset,
  isLoading,
  onPageChange,
  onOffsetChange,
}) => {
  const { classes, cx } = useStyles();

  const navigate = useNavigate();

  const downloadProjectById = useDownloadProject();
  const { cloneProject } = useCloneProjectRequest();

  const rowActions = useMemo(
    () => [
      {
        id: 'copy',
        icon: <ContentCopyIcon fontSize="small" />,
        action: (id: string) => cloneProject(id),
      },
      {
        id: 'view',
        icon: <VisibilityIcon fontSize="small" />,
        action: (id: string) => navigate(`/view/${id}`),
      },
      {
        id: 'download',
        icon: <DownloadIcon fontSize="small" />,
        action: (id: string) => downloadProjectById(id),
      },
    ],
    [],
  );

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ProjectListItem>('title');

  const handleSort = (property: keyof ProjectListItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows = offset - rows.length;

  const sortedRows = useMemo(() => {
    const { getSortable } = headCells.find((it) => it.id === orderBy);

    return orderRowsBy(rows, (row) => getSortable(row[orderBy]), order);
  }, [order, orderBy, rows]);

  const paginationRef = useRef<HTMLDivElement>();

  const [paginationHeight, setPaginationHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = paginationRef.current.getBoundingClientRect();
    setPaginationHeight(height);
  }, []);

  return (
    <Box className={classes.tableContainer}>
      {isLoading && <CircularProgress className={classes.loader} />}

      <TableContainer style={{ height: `calc(100% - ${paginationHeight}px)` }} className={classes.table}>
        <Table size="medium" stickyHeader className={classes.table}>
          <TableHead headCells={headCells} order={order} orderBy={orderBy} onSort={handleSort} rowCount={sortedRows.length} />

          <TableBody className={cx({ [classes.hiddenBody]: isLoading })}>
            {sortedRows.map((row) => (
              <TableRow className={classes.row} role="checkbox" tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }} hover>
                <TableCell className={classes.cell} component="th" scope="row" padding="none">
                  <Link component={RRLink} to={`/view/${row.id}`} variant="body2">
                    {row.title}
                  </Link>
                </TableCell>

                <TableCell className={classes.cell} component="th" scope="row" padding="none">
                  <LimitedText text={row.description} charCount={50} />
                </TableCell>

                <TableCell className={classes.cell} component="th" scope="row" padding="none">
                  {`${row.user.firstName} ${row.user.lastName}`}
                </TableCell>

                <TableCell className={classes.cell} component="th" scope="row" padding="none">
                  {new Date(row.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell className={classes.cell} component="th" scope="row" padding="none">
                  {new Date(row.updated_at).toLocaleDateString()}

                  <span className={classes.moreIcon}>
                    <RowActionsTooltip id={row.id} actions={rowActions} />
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 43 * emptyRows,
                }}
              >
                <TableCell
                  style={{
                    borderBottom: 'none',
                  }}
                  colSpan={6}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        ref={paginationRef}
        totalCount={count}
        page={page}
        offset={offset}
        onPageChange={onPageChange}
        onOffsetChange={onOffsetChange}
        offsetOptions={[20, 50, 100]}
      />
    </Box>
  );
};
