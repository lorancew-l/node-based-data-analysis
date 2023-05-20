import { memo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch, updateDependents, updateNodeById } from '../../../../store';
import { BoardNode, NodeData, NodeIOObjectData, NodeIOTableData } from '../../../../types';
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

type GroupByComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOTableData, NodeIOObjectData>;
};

export const GroupByComponent: React.FC<GroupByComponentProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const readonly = useReadonlyContext();

  const dispatch = useAppDispatch();

  const { input } = data;

  const { columns } = input;
  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const selectedColumn = data.params?.column ?? '';

  const handleColumnChange = (newColumn: number | '') => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column: newColumn },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  return (
    <div className={classes.container}>
      <Select label="Колонка" value={selectedColumn} onChange={handleColumnChange} options={columnsOptions} disabled={readonly} />
    </div>
  );
});
