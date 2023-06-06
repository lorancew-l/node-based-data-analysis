import { memo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch, updateDependents, updateNodeById } from '../../../../store';
import { BoardNode, NodeData, NodeIOObjectData, SortOrder } from '../../../../types';
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

  const readonly = useReadonlyContext();

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
      <Select label="Колонка" value={selectedColumn} onChange={handleColumnChange} options={columnsOptions} disabled={readonly} />

      <Select label="Order" value={selectedOrder} onChange={handleOrderChange} options={sortOrderOptions} disabled={readonly} />
    </div>
  );
});
