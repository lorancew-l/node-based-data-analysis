import { memo, useState, useMemo } from 'react';
import { cloneDeep } from 'lodash';
import { TextField, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch, updateDependents, updateNodeById } from '../../../../store';
import { BoardNode, NodeData, NodeIOObjectData } from '../../../../types';
import { Select } from '../../../../components';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
  row: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  addColumnButton: {
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    color: theme.palette.text.secondary,
    cursor: 'pointer',
  },
}));

type RenameColumnValue = {
  originalName: string;
  newName: string;
};

type RenameColumnsComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOObjectData, NodeIOObjectData>;
};

export const RenameColumnsComponent: React.FC<RenameColumnsComponentProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const { columns } = data.input;

  const [renamedColumns, setRenamedColumns] = useState<RenameColumnValue[]>([{ originalName: columns[0], newName: '' }]);
  const [pickedColumns, setPickedColumns] = useState<string[]>([columns[0]]);

  const columnOptions = useMemo(() => columns.map((column) => ({ value: column, label: column })), [columns]);

  const handleColumnSelect = (index: number) => (column: string) => {
    const { originalName: currentColumn } = renamedColumns[index];

    setPickedColumns((prevColumns) => [...prevColumns.filter((column) => column !== currentColumn), column]);
    setRenamedColumns((prevRenamedColumns) => {
      const newRenamedColumns = cloneDeep(prevRenamedColumns);
      prevRenamedColumns[index].originalName = column;

      return newRenamedColumns;
    });
  };

  const handleNewColumnNameChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setRenamedColumns((prevRenamedColumns) => {
      const newRenamedColumns = cloneDeep(prevRenamedColumns);
      newRenamedColumns[index].newName = value;

      return newRenamedColumns;
    });
  };

  const handleAddColumn = () => {
    setRenamedColumns((prevRenamedColumns) => [...prevRenamedColumns, { originalName: '', newName: '' }]);
  };

  const handleApply = () => {
    const newColumns = columns.map((column) => {
      const newColumn = renamedColumns.find(({ originalName }) => originalName === column);

      return newColumn?.newName ? newColumn.newName : column;
    });

    dispatch(
      updateNodeById({
        id,
        data: {
          params: { columns: newColumns },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  return (
    <div className={classes.container}>
      {renamedColumns.map(({ newName, originalName }, index) => (
        <div key={index} className={classes.row}>
          <Select
            value={originalName}
            onChange={handleColumnSelect(index)}
            options={columnOptions}
            disabledOptions={pickedColumns}
            fullWidth
          />

          <TextField className="nodrag" value={newName} onChange={handleNewColumnNameChange(index)} size="small" fullWidth />
        </div>
      ))}

      <button className={classes.addColumnButton} onClick={handleAddColumn} disabled={renamedColumns.length === columns.length}>
        + add column
      </button>

      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
});
