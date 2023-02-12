import { memo, useRef, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useVirtual } from 'react-virtual';
import { makeStyles } from 'tss-react/mui';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { NodeIOTableData } from '../../types';

const useStyles = makeStyles()((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.default,
  },
  tableContainer: {
    height: '100%',
    maxHeight: '100%',
    overflow: 'auto',
  },
  bodyContainer: {},
  cell: {
    lineHeight: 1,
    minWidth: 150,
    maxWidth: 150,
    padding: theme.spacing(1),
  },
}));
type OutputTableProps = {
  data: NodeIOTableData;
};

export const OutputTable: React.FC<OutputTableProps> = memo(({ data }) => {
  const { classes } = useStyles();
  const { columns, data: rows } = data;

  const tableColumns = useMemo<ColumnDef<any>[]>(
    () =>
      columns.map((column, index) => ({
        id: column || 'index',
        header: column || 'index',
        accessorFn: (row) => row[index],
      })),
    [columns],
  );

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      size: 200,
      minSize: 200,
    },
  });

  const tableContainerRef = useRef<HTMLDivElement>();

  const { rows: tableRows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: tableRows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  if (!rows.length) {
    return null;
  }

  return (
    <TableContainer className={classes.tableContainer} ref={tableContainerRef}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead className={classes.header}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  className={classes.cell}
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                  align="left"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = tableRows[virtualRow.index] as Row<string[]>;
            return (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell className={classes.cell} align="left" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
