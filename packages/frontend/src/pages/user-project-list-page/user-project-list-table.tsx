import { useMemo, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RRLink } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  Link,
  CircularProgress,
  Checkbox,
  Collapse,
  Typography,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { orderBy as orderRowsBy } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import { ProjectListItem } from '../../api';
import { useDownloadProject } from '../edit-page/use-download-project';
import { TableHead, HeadCell, RowActionsTooltip, Pagination } from '../../components/table';

const useStyles = makeStyles()((theme) => ({
  drawer: {
    height: 60,
    width: '100vw',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5),
  },
  drawerWrap: {
    position: 'fixed',
    top: 0,
    left: 0,
  },
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
    '& td': {
      height: 42,
    },
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

type UserProjectListTableProps = {
  rows: ProjectListItem[];
  count: number;
  page: number;
  offset: number;
  isLoading: boolean;
  onCloneProject(id: string): void;
  onRemoveProject(idList: string[]): Promise<any>;
  onPageChange(page: number): void;
  onOffsetChange(offset: number): void;
};

export const UserProjectListTable: React.FC<UserProjectListTableProps> = ({
  isLoading,
  rows,
  count,
  page,
  offset,
  onCloneProject,
  onRemoveProject,
  onPageChange,
  onOffsetChange,
}) => {
  const { classes, cx } = useStyles();

  const navigate = useNavigate();

  const downloadProjectById = useDownloadProject();

  const rowActions = useMemo(
    () => [
      {
        id: 'copy',
        icon: <ContentCopyIcon fontSize="small" />,
        action: onCloneProject,
      },
      {
        id: 'edit',
        icon: <EditIcon fontSize="small" />,
        action: (id: string) => navigate(`/edit/${id}`),
      },
      {
        id: 'delete',
        icon: <DeleteIcon fontSize="small" />,
        action: (id: string) => onRemoveProject([id]),
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

  const [selectedRows, setSelectedRows] = useState<ProjectListItem['id'][]>([]);

  const handleSelectRow = (id: ProjectListItem['id']) => () =>
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      }

      return [...prevSelectedRows, id];
    });

  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveSelected = async () => {
    setIsRemoving(true);

    await onRemoveProject(selectedRows);

    setSelectedRows([]);
    setIsRemoving(false);
  };

  const handleSelectAll = () => {
    if (!selectedRows.length) {
      setSelectedRows(rows.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

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
          <TableHead
            selectedCount={selectedRows.length}
            totalCount={rows.length}
            onSelectAll={handleSelectAll}
            headCells={headCells}
            order={order}
            orderBy={orderBy}
            onSort={handleSort}
            rowCount={sortedRows.length}
          />

          <TableBody className={cx({ [classes.hiddenBody]: isLoading })}>
            {sortedRows.map((row) => (
              <TableRow
                className={classes.row}
                role="checkbox"
                tabIndex={-1}
                key={row.id}
                sx={{ cursor: 'pointer' }}
                onClick={handleSelectRow(row.id)}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox color="primary" checked={selectedRows.includes(row.id)} />
                </TableCell>

                <TableCell component="th" scope="row" padding="none">
                  <Link component={RRLink} to={`/edit/${row.id}`} variant="body2">
                    {row.title}
                  </Link>
                </TableCell>

                <TableCell component="th" scope="row" padding="none">
                  <LimitedText text={row.description} charCount={70} />
                </TableCell>

                <TableCell component="th" scope="row" padding="none">
                  {new Date(row.created_at).toLocaleDateString()}
                </TableCell>

                <TableCell component="th" scope="row" padding="none">
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

      <div className={classes.drawerWrap}>
        <Collapse in={!!selectedRows.length} timeout={200}>
          <Paper className={classes.drawer} elevation={2}>
            <Typography>{`${selectedRows.length || 1} выбрано`}</Typography>

            <IconButton size="small" onClick={handleRemoveSelected}>
              {isRemoving ? <CircularProgress size={16} /> : <DeleteIcon />}
            </IconButton>
          </Paper>
        </Collapse>
      </div>
    </Box>
  );
};
