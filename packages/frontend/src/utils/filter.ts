import { NAN_VALUES } from './common';
import { Filter } from '../types';

const stringEqual = (text: string, pattern: string) => text === pattern;

const stringNotEqual = (text: string, pattern: string) => text !== pattern;

const stringIncludes = (text: string, pattern: string) => text.includes(pattern);

const stringNotIncludes = (text: string, pattern: string) => !text.includes(pattern);

const stringNotEmpty = (text: string) => !NAN_VALUES.includes(text);

const numberGreater = (firstNumber: string, secondNumber: string) => Number(firstNumber) > Number(secondNumber);

const numberGreaterOrEqual = (firstNumber: string, secondNumber: string) => Number(firstNumber) >= Number(secondNumber);

const numberLess = (firstNumber: string, secondNumber: string) => Number(firstNumber) < Number(secondNumber);

const numberLessOrEqual = (firstNumber: string, secondNumber: string) => Number(firstNumber) <= Number(secondNumber);

export const getFilter = (filterType: Filter) => {
  switch (filterType) {
    case Filter.Equal:
      return stringEqual;
    case Filter.NotEqual:
      return stringNotEqual;
    case Filter.Includes:
      return stringIncludes;
    case Filter.NotIncludes:
      return stringNotIncludes;
    case Filter.NotEmpty:
      return stringNotEmpty;
    case Filter.NumberGreater:
      return numberGreater;
    case Filter.NumberGreaterOrEqual:
      return numberGreaterOrEqual;
    case Filter.NumberLess:
      return numberLess;
    case Filter.NumberLessOrEqual:
      return numberLessOrEqual;
    default:
      return () => true;
  }
};
