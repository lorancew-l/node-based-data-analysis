import React, { memo, useMemo, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch } from '../../../store/hooks';
import { updateDependents, updateNodeById } from '../../../store/reducers/board';
import { BoardNode, NodeData, NodeIOObjectData, NodeIOTableData, Filter } from '../../../types';
import { Select } from '../../select';
import { getColumnDataType } from '../../../utils/common';
import { dataTypeToOptions } from './data-type-to-options';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

type FilterComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOTableData, NodeIOObjectData>;
};

export const FilterComponent: React.FC<FilterComponentProps> = memo(({ id, data }) => {
  const { cx, classes } = useStyles();

  const dispatch = useAppDispatch();

  const { input, params } = data;
  const { columns } = input;

  const [selectedColumn, setSelectedColumn] = useState<number>(params.column ?? 0);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(params.filter ?? Filter.Equal);
  const [pattern, setPattern] = useState<string>(params.pattern ?? '');

  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const columnDataType = useMemo(() => getColumnDataType(input.data, selectedColumn), [selectedColumn]);

  const filterOptions = dataTypeToOptions[columnDataType];

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPattern(value);
  };

  const handleApply = () => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column: selectedColumn, filter: selectedFilter, pattern },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  return (
    <div className={cx(classes.container, 'nodrag')}>
      <Select label="Column" value={selectedColumn} onChange={setSelectedColumn} options={columnsOptions} />

      <Select label="Condition" value={selectedFilter} onChange={setSelectedFilter} options={filterOptions} />

      {selectedFilter !== Filter.NotEmpty && <TextField value={pattern} onChange={handlePatternChange} />}

      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
});
