import { NodeIOTableData, SortOrder } from '../types';

const sortNumber = (order: SortOrder) => (a: string, b: string) => {
  const firstNumber = Number(a);
  const secondNumber = Number(b);

  return order === SortOrder.Ascending ? firstNumber - secondNumber : secondNumber - firstNumber;
};

const sortString = (order: SortOrder) => (a: string, b: string) => {
  if (order === SortOrder.Ascending) {
    return a > b ? 1 : -1;
  }

  return a < b ? 1 : -1;
};

export const getSortFunction = (order: SortOrder, isNumber: boolean) => {
  return isNumber ? sortNumber(order) : sortString(order);
};
