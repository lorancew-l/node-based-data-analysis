import { DataType, Filter } from '../../../../types';

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
      label: 'Не пустое или NaN',
    },
  ],
  [DataType.String]: [
    {
      value: Filter.Equal,
      label: 'Текст равен',
    },
    {
      value: Filter.NotIncludes,
      label: 'Текст не равен',
    },
    {
      value: Filter.Includes,
      label: 'Текст включает',
    },
    {
      value: Filter.NotIncludes,
      label: 'Текст не включает',
    },
    {
      value: Filter.NotEmpty,
      label: 'Не пустое',
    },
  ],
};
