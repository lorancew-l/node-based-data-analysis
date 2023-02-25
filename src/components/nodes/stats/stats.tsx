import { mean, min, max, sum } from 'lodash';
import { memo, useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { BoardNode, NodeData, NodeIOTableData } from '../../../types';
import { Select } from '../../select';
import { median } from '../../../utils/common';
import { Stat } from './stat';
import { arrayToNumber } from '../../../utils/node';
import { useAppDispatch } from '../../../store/hooks';
import { updateNodeById } from '../../../store/reducers/board';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

type StatsComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOTableData, NodeIOTableData>;
};

export const StatsComponent: React.FC<StatsComponentProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const { input, params } = data;
  const { columns, data: dataset } = input;

  const selectedColumn = params.column ?? '';

  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const stats = useMemo(() => {
    if (selectedColumn === '') {
      return {};
    }

    const columnData = arrayToNumber(dataset.map((row) => row[selectedColumn]));

    return {
      min: min(columnData),
      max: max(columnData),
      mean: mean(columnData),
      sum: sum(columnData),
      median: median(columnData),
      count: columnData.length,
    };
  }, [dataset, selectedColumn]);

  const handleColumnChange = (column: number | '') => {
    dispatch(updateNodeById({ id, data: { params: { column } } }));
  };

  return (
    <div className={classes.container}>
      <Select label="Columns" value={selectedColumn} onChange={handleColumnChange} options={columnsOptions} />

      <Stat label="Min" value={stats.min} />

      <Stat label="Max" value={stats.max} />

      <Stat label="Mean" value={stats.mean} />

      <Stat label="Median" value={stats.median} />

      <Stat label="Sum" value={stats.sum} />

      <Stat label="Count" value={stats.count} />
    </div>
  );
});
