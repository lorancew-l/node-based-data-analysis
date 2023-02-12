import { isArray, isNaN } from 'lodash';

import { NodeIOData, NodeIOTableData, DataType } from '../types';

export const isTableData = (data?: NodeIOData): data is NodeIOTableData => isArray(data.data);

export const median = (numbers: number[]) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
};

export const NAN_VALUES = ['NaN', 'nan', 'null', 'na', '', null, undefined, NaN];

export const getColumnDataType = (data: NodeIOTableData['data'], columnIndex: number) => {
  const { stringCount, numberCount } = data.reduce(
    (result, row) => {
      const value = row[columnIndex]?.trim();

      if (NAN_VALUES.includes(value)) {
        return result;
      }
      const isNumber = !isNaN(Number(value));

      if (isNumber) {
        result.numberCount += 1;
      } else {
        result.stringCount += 1;
      }

      return result;
    },
    { stringCount: 0, numberCount: 0 },
  );

  return numberCount > stringCount ? DataType.Number : DataType.String;
};
