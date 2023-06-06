import React, { memo, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { useAppDispatch } from '../../../../store/hooks';
import { updateDependents, updateNodeById } from '../../../../store/reducers/board';
import { BoardNode, NodeData, NodeIOObjectData, NodeIOTableData, Filter, ReplaceCondition } from '../../../../types';
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

const replaceConditionOptions = [{ value: ReplaceCondition.Contains, label: 'Contains' }];

type ReplaceComponentProps = {
  id: BoardNode['id'];
  data: NodeData<NodeIOTableData, NodeIOObjectData>;
};

export const ReplaceComponent: React.FC<ReplaceComponentProps> = memo(({ id, data }) => {
  const { cx, classes } = useStyles();

  const readonly = useReadonlyContext();

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
      <Select label="Колонка" value={selectedColumn} onChange={setSelectedColumn} options={columnsOptions} disabled={readonly} />

      <Select
        label="Условие"
        value={replaceCondition}
        onChange={setReplaceCondition}
        options={replaceConditionOptions}
        disabled={readonly}
      />

      <TextField label="Pattern" value={pattern} onChange={handlePatternChange} disabled={readonly} />

      <TextField label="Value" value={newValue} onChange={handleNewValueChange} disabled={readonly} />

      <Button onClick={handleApply} disabled={readonly}>
        Apply
      </Button>
    </div>
  );
});
