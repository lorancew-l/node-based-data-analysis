import React, { memo, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch } from '../../../../store/hooks';
import { updateDependents, updateNodeById } from '../../../../store/reducers/board';
import { BoardNode, NodeData, NodeIOObjectData, NodeIOTableData, Filter, ReplaceCondition } from '../../../../types';
import { Select } from '../../../../components';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

const replaceConditionOptions = [{ value: ReplaceCondition.Contains, label: 'Contains' }];

type ReplaceComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOTableData, NodeIOObjectData>;
};

export const ReplaceComponent: React.FC<ReplaceComponentProps> = memo(({ id, data }) => {
  const { cx, classes } = useStyles();

  const dispatch = useAppDispatch();

  const { input, params } = data;
  const { columns } = input;

  const [selectedColumn, setSelectedColumn] = useState<number>(params.column ?? 0);
  const [replaceCondition, setReplaceCondition] = useState<ReplaceCondition>(params.filter ?? Filter.Equal);
  const [pattern, setPattern] = useState<string>(params.pattern ?? '');
  const [newValue, setNewValue] = useState<string>(params.newValue ?? '');

  const columnsOptions = columns.map((column, index) => ({ value: index, label: column }));

  const handleNewValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewValue(value);
  };

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPattern(value);
  };

  const handleApply = () => {
    dispatch(
      updateNodeById({
        id,
        data: {
          params: { column: selectedColumn, condition: replaceCondition, newValue, pattern },
        },
      }),
    );
    dispatch(updateDependents(id));
  };

  return (
    <div className={cx(classes.container, 'nodrag')}>
      <Select label="Column" value={selectedColumn} onChange={setSelectedColumn} options={columnsOptions} />

      <Select label="Condition" value={replaceCondition} onChange={setReplaceCondition} options={replaceConditionOptions} />

      <TextField label="Pattern" value={pattern} onChange={handlePatternChange} />

      <TextField label="Value" value={newValue} onChange={handleNewValueChange} />

      <Button onClick={handleApply}>Apply</Button>
    </div>
  );
});
