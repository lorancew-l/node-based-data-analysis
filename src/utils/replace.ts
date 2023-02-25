import { ReplaceCondition } from '../types';

const contains = (value: string, pattern: string, newValue: string) => {
  if (value.toLowerCase().includes(pattern.toLowerCase())) {
    return newValue;
  }

  return value;
};

export const getReplaceFunction = (condition: ReplaceCondition) => {
  switch (condition) {
    case ReplaceCondition.Contains:
      return contains;
    default:
      return (value: string) => value;
  }
};
