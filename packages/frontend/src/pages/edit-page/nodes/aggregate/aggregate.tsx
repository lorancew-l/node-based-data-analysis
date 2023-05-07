import { memo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch, updateDependents, updateNodeById } from '../../../../store';
import { BoardNode, NodeData, NodeIOObjectData, AggregateFunctionName } from '../../../../types';
import { Select, Option } from '../../../../components';
import { useReadonlyContext } from '../../readonly-context';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

const aggregateFunctionOptions: Option<AggregateFunctionName>[] = [
  { label: 'Count', value: AggregateFunctionName.Count },
  { label: 'Mean', value: AggregateFunctionName.Mean },
  { label: 'Min', value: AggregateFunctionName.Min },
  { label: 'Max', value: AggregateFunctionName.Max },
];

type AggregateComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOObjectData, NodeIOObjectData>;
};

export const AggregateComponent: React.FC<AggregateComponentProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const readonly = useReadonlyContext();

  const dispatch = useAppDispatch();

  const columns = data.input.columns ?? [];
  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const selectedColumn = data.params.column ?? '';
  const selectedFunction = data.params?.func ?? '';

  const handleColumnChange = (newColumn: number | '') => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column: newColumn, func: selectedFunction },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  const handleFunctionChange = (func: AggregateFunctionName) => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column: selectedColumn, func },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  return (
    <div className={classes.container}>
      <Select label="Column" value={selectedColumn} onChange={handleColumnChange} options={columnsOptions} disabled={readonly} />

      <Select
        label="Function"
        value={selectedFunction}
        onChange={handleFunctionChange}
        options={aggregateFunctionOptions}
        disabled={readonly}
      />
    </div>
  );
});
