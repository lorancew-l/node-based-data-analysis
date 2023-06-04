import { v4 as makeId } from 'uuid';
import { groupBy, max, min, mean, isUndefined } from 'lodash';

import {
  BoardNode,
  NodeIOData,
  NodeIOObjectData,
  NodeIOTableData,
  NodeType,
  AggregateFunction,
  AggregateFunctionName,
  Filter,
  IOType,
  SortOrder,
  DataType,
  ReplaceCondition,
} from '../types';
import { getFilter } from './filter';
import { getColumnDataType } from './common';
import { getSortFunction } from './sort';
import { getReplaceFunction } from './replace';

export const createNode = (nodeType: NodeType, position: BoardNode['position'] = { x: 0, y: 0 }): BoardNode => {
  const id = makeId();

  switch (nodeType) {
    case NodeType.FileLoader:
      return {
        id,
        position,
        type: NodeType.FileLoader,
        data: {
          inputType: [],
          outputType: [IOType.Table],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.ScatterPlot:
      return {
        id,
        position,
        type: NodeType.ScatterPlot,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.BarPlot:
      return {
        id,
        position,
        type: NodeType.BarPlot,
        data: {
          inputType: [IOType.Object],
          outputType: [IOType.Object],
          input: { columns: [], data: {} },
          output: { columns: [], data: {} },
        },
      };
    case NodeType.GroupBy:
      return {
        id,
        position,
        type: NodeType.GroupBy,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Object],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: {} },
        },
      };
    case NodeType.Aggregate:
      return {
        id,
        position,
        type: NodeType.Aggregate,
        data: {
          inputType: [IOType.Object],
          outputType: [IOType.Object],
          params: {},
          input: { columns: [], data: {} },
          output: { columns: [], data: {} },
        },
      };
    case NodeType.RenameColumns:
      return {
        id,
        position,
        type: NodeType.RenameColumns,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.DropColumns:
      return {
        id,
        position,
        type: NodeType.DropColumns,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.Stats:
      return {
        id,
        position,
        type: NodeType.Stats,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.Markdown:
      return {
        id,
        position,
        type: NodeType.Markdown,
        data: {
          inputType: [],
          outputType: [],
          params: { markdown: '' },
        },
      };
    case NodeType.Filter:
      return {
        id,
        position,
        type: NodeType.Filter,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.LinePlot:
      return {
        id,
        position,
        type: NodeType.LinePlot,
        data: {
          inputType: [IOType.Table, IOType.Object],
          outputType: [IOType.Table, IOType.Object],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.Sort:
      return {
        id,
        position,
        type: NodeType.Sort,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    case NodeType.Replace:
      return {
        id,
        position,
        type: NodeType.Replace,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
          params: {},
        },
      };
    case NodeType.HistPlot:
      return {
        id,
        position,
        type: NodeType.HistPlot,
        data: {
          inputType: [IOType.Table],
          outputType: [IOType.Table],
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
          params: {},
        },
      };
    case NodeType.PieChart:
      return {
        id,
        position,
        type: NodeType.PieChart,
        data: {
          inputType: [IOType.Object],
          outputType: [IOType.Object],
          params: {},
          input: { columns: [], data: [] },
          output: { columns: [], data: [] },
        },
      };
    default:
      return {} as BoardNode;
  }
};

export const arrayToNumber = (array: string[]) => array.map((value) => Number(value));

export const count = (value: number[]) => value.length;

const aggregationNameToFunction: Record<AggregateFunctionName, AggregateFunction> = {
  [AggregateFunctionName.Count]: count,
  [AggregateFunctionName.Mean]: mean,
  [AggregateFunctionName.Min]: min,
  [AggregateFunctionName.Max]: max,
};

const transformGroupBy = (data: NodeIOTableData, { column }: { column: number }) => {
  if (isUndefined(column)) {
    return { columns: [], data: {} };
  }

  const { columns, data: rows } = data;
  const output = groupBy(rows, column);

  return {
    columns,
    data: output,
  };
};

const transformAggregation = (
  { columns, data }: NodeIOObjectData<Record<string, string[][]>>,
  { func, column }: { func: AggregateFunctionName; column: number },
) => {
  if (!func || isUndefined(column)) {
    return { columns: [], data: {} };
  }

  const AggregateFunction = aggregationNameToFunction[func];

  const output = Object.entries(data).reduce((result, [key, array]) => {
    result[key] = AggregateFunction(arrayToNumber(array.map((value) => value[column]))) ?? null;

    return result;
  }, {} as Record<string, number>);

  return {
    columns,
    data: output,
  };
};

const transformRenameColumns = (data: NodeIOTableData, { columns }: { columns: string[] }) => {
  return {
    columns: columns ?? data.columns,
    data: data.data,
  };
};

const transformDropColumns = (data: NodeIOTableData, { droppedColumns }: { droppedColumns: number[] }) => {
  const droppedData = data.data.map((row) => row.filter((_, index) => !droppedColumns?.includes(index)));

  return {
    columns: data.columns.filter((_, index) => !droppedColumns?.includes(index)),
    data: droppedData,
  };
};

const transformFilter = (
  data: NodeIOTableData,
  { column, filter, pattern }: { column: number; filter: Filter; pattern: string },
) => {
  const filterFn = getFilter(filter);
  const filteredData = data.data.filter((row) => filterFn(row[column], pattern));

  return {
    columns: data.columns,
    data: filteredData,
  };
};

const transformSort = (data: NodeIOTableData, { column, order }: { column: number; order: SortOrder }) => {
  const columDataType = getColumnDataType(data.data, column);
  const isNumber = columDataType === DataType.Number;
  const sortFunction = getSortFunction(order, isNumber);

  const sortedData = [...data.data].sort((firstRow, secondRow) => sortFunction(firstRow[column], secondRow[column]));

  return {
    columns: data.columns,
    data: sortedData,
  };
};

const transformReplace = (
  data: NodeIOTableData,
  { column, condition, pattern, newValue }: { column: number; condition: ReplaceCondition; pattern: string; newValue: string },
) => {
  const replaceFn = getReplaceFunction(condition);

  const newData = data.data.map((row) => {
    const newRow = [...row];
    const value = newRow[column];
    newRow[column] = replaceFn(value, pattern, newValue);

    return newRow;
  });

  return {
    columns: data.columns,
    data: newData,
  };
};

export const transformNodeData = (nodeType: NodeType, data: NodeIOData, params: any) => {
  switch (nodeType) {
    case NodeType.GroupBy:
      return transformGroupBy(data as NodeIOTableData, params);
    case NodeType.Aggregate:
      return transformAggregation(data as NodeIOObjectData<any>, params);
    case NodeType.RenameColumns:
      return transformRenameColumns(data as NodeIOTableData, params);
    case NodeType.DropColumns:
      return transformDropColumns(data as NodeIOTableData, params);
    case NodeType.Filter:
      return transformFilter(data as NodeIOTableData, params);
    case NodeType.Sort:
      return transformSort(data as NodeIOTableData, params);
    case NodeType.Replace:
      return transformReplace(data as NodeIOTableData, params);
    default:
      return data;
  }
};
