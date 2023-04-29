import { memo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch } from '../../../store/hooks';
import { updateDependents, updateNodeById } from '../../../store/reducers/board';
import { BoardNode, NodeData, NodeIOObjectData, SortOrder } from '../../../types';
import { Select } from '../../select';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

const sortOrderOptions = [
  { value: SortOrder.Ascending, label: 'Ascending' },
  { value: SortOrder.Descending, label: 'Descending' },
];

type SortComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOObjectData, NodeIOObjectData>;
};

export const SortComponent: React.FC<SortComponentProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const { columns } = data.input;
  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const selectedColumn = data.params.column ?? '';
  const selectedOrder = data.params.order ?? SortOrder.Ascending;

  const handleColumnChange = (column: number | '') => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column, order: selectedOrder },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  const handleOrderChange = (order: SortOrder) => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column: selectedColumn, order },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  return (
    <div className={classes.container}>
      <Select label="Column" value={selectedColumn} onChange={handleColumnChange} options={columnsOptions} />

      <Select label="Order" value={selectedOrder} onChange={handleOrderChange} options={sortOrderOptions} />
    </div>
  );
});
