import React, { memo, useMemo, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch, updateDependents, updateNodeById } from '../../../../store';
import { BoardNode, NodeData, NodeIOObjectData, NodeIOTableData, Filter } from '../../../../types';
import { Select } from '../../../../components';
import { getColumnDataType } from '../../../../utils/common';
import { dataTypeToOptions } from './data-type-to-options';
import { useReadonlyContext } from '../../readonly-context';

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

  const readonly = useReadonlyContext();

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
      <Select label="Column" value={selectedColumn} onChange={setSelectedColumn} options={columnsOptions} disabled={readonly} />

      <Select label="Condition" value={selectedFilter} onChange={setSelectedFilter} options={filterOptions} disabled={readonly} />

      {selectedFilter !== Filter.NotEmpty && <TextField value={pattern} onChange={handlePatternChange} disabled={readonly} />}

      <Button onClick={handleApply} disabled={readonly}>
        Apply
      </Button>
    </div>
  );
});
