import { TableCell, TableHead as MUITableHead, TableRow, TableSortLabel, Checkbox } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  headCell: {
    height: 56,
  },
}));
export type Order = 'asc' | 'desc';

export type HeadCell<T> = {
  id: T;
  label: string;
  sortable: boolean;
};

type TableHeadProps<T> = {
  selectedCount?: number;
  totalCount?: number;
  headCells: HeadCell<T>[];
  onSort(property: T): void;
  onSelectAll?(): void;
  order: Order;
  orderBy: string;
  rowCount: number;
};

export const TableHead = <T extends string>({
  selectedCount,
  totalCount,
  headCells,
  order,
  orderBy,
  onSort,
  onSelectAll,
}: TableHeadProps<T>) => {
  const { classes } = useStyles();

  const handleSort = (property: T) => () => {
    onSort(property);
  };

  return (
    <MUITableHead>
      <TableRow>
        {onSelectAll && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={selectedCount === totalCount}
              indeterminate={selectedCount > 0 && selectedCount < totalCount}
              onChange={onSelectAll}
            />
          </TableCell>
        )}

        {headCells.map((headCell, index) => (
          <TableCell
            className={classes.headCell}
            key={headCell.id}
            align="left"
            padding={!onSelectAll && index === 0 ? 'normal' : 'none'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon={!headCell.sortable}
              active={headCell.sortable && orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={handleSort(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </MUITableHead>
  );
};
