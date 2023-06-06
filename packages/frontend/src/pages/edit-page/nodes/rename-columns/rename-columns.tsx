import { memo, useMemo } from 'react';
import { cloneDeep } from 'lodash';
import { TextField, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch, updateDependents, updateNodeById } from '../../../../store';
import { BoardNode, NodeData, NodeIOObjectData } from '../../../../types';
import { Select } from '../../../../components';
import { useReadonlyContext } from '../../readonly-context';

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

  const readonly = useReadonlyContext();

  const dispatch = useAppDispatch();

  const { columns } = data.input;
  const { renamedColumns = [] }: { renamedColumns: RenameColumnValue[] } = data.params;

  const pickedColumns = useMemo(() => renamedColumns.map(({ originalName }) => originalName), [renamedColumns]);

  const columnOptions = useMemo(() => columns.map((column) => ({ value: column, label: column })), [columns]);

  const handleColumnsChange = (renamedColumns: RenameColumnValue[]) => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { renamedColumns },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  const handleColumnSelect = (index: number) => (column: string) => {
    const newRenamedColumns = cloneDeep(renamedColumns);
    newRenamedColumns[index].originalName = column;

    handleColumnsChange(newRenamedColumns);
  };

  const handleNewColumnNameChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const newRenamedColumns = cloneDeep(renamedColumns);
    newRenamedColumns[index].newName = value;

    handleColumnsChange(newRenamedColumns);
  };

  const handleAddColumn = () => {
    const newRenamedColumns = cloneDeep(renamedColumns);
    newRenamedColumns.push({ originalName: '', newName: '' });

    handleColumnsChange(newRenamedColumns);
  };

  const handleRemoveColumn = (columnIndex: number) => () => {
    const newRenamedColumns = cloneDeep(renamedColumns).filter((_, index) => index !== columnIndex);
    handleColumnsChange(newRenamedColumns);
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
            disabled={readonly}
            fullWidth
          />

          <TextField
            className="nodrag"
            value={newName}
            onChange={handleNewColumnNameChange(index)}
            size="small"
            disabled={readonly}
            fullWidth
          />

          <IconButton size="small" onClick={handleRemoveColumn(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}

      <button
        className={classes.addColumnButton}
        onClick={handleAddColumn}
        disabled={readonly || renamedColumns.length === columns.length}
      >
        + колонка
      </button>
    </div>
  );
});
