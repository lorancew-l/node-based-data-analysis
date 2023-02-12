import { DataType, Filter } from '../../../types';

export const dataTypeToOptions = {
  [DataType.Number]: [
    {
      value: Filter.Equal,
      label: '=',
    },
    {
      value: Filter.NotEqual,
      label: '≠',
    },
    {
      value: Filter.NumberGreater,
      label: '>',
    },
    {
      value: Filter.NumberGreaterOrEqual,
      label: '≥',
    },
    {
      value: Filter.NumberLess,
      label: '<',
    },
    {
      value: Filter.NumberLessOrEqual,
      label: '≤',
    },
    {
      value: Filter.NotEmpty,
      label: 'Not empty or NaN',
    },
  ],
  [DataType.String]: [
    {
      value: Filter.Equal,
      label: 'Text equal',
    },
    {
      value: Filter.NotIncludes,
      label: 'Text is not equal',
    },
    {
      value: Filter.Includes,
      label: 'Text includes',
    },
    {
      value: Filter.NotIncludes,
      label: 'Text does not includes',
    },
    {
      value: Filter.NotEmpty,
      label: 'Is not empty',
    },
  ],
};
