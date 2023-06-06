import React, { memo, useMemo } from 'react';
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

  const { column = 0, filter: filter = Filter.Equal, pattern = '' } = params;

  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const columnDataType = useMemo(() => getColumnDataType(input.data, column), [column]);

  const filterOptions = dataTypeToOptions[columnDataType];

  const handleParameterChange = (parameter: 'column' | 'filter' | 'pattern', value: any) => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column, filter, pattern, [parameter]: value },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  const handleColumnChange = (column: number) => handleParameterChange('column', column);

  const handleFilterChange = (filter: string) => handleParameterChange('filter', filter);

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleParameterChange('pattern', event.target.value);
  };

  return (
    <div className={cx(classes.container, 'nodrag')}>
      <Select label="Колонка" value={column} onChange={handleColumnChange} options={columnsOptions} disabled={readonly} />

      <Select label="Условие" value={filter} onChange={handleFilterChange} options={filterOptions} disabled={readonly} />

      {filter !== Filter.NotEmpty && <TextField value={pattern} onChange={handlePatternChange} disabled={readonly} />}
    </div>
  );
});
