import { memo } from 'react';
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
}));

type DropColumnsComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOObjectData, NodeIOObjectData>;
};

export const DropColumnsComponent: React.FC<DropColumnsComponentProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const readonly = useReadonlyContext();

  const { columns } = data.input;
  const droppedColumns = data.params.droppedColumns ?? [];
  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const handleColumnsChange = (newColumns: number[]) => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { droppedColumns: newColumns },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  return (
    <div className={classes.container}>
      <Select
        label="Columns"
        value={droppedColumns}
        onChange={handleColumnsChange as any}
        options={columnsOptions}
        disabled={readonly}
        multiple
      />
    </div>
  );
});
