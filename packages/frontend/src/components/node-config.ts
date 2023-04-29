import { NodeType } from '../types';
import {
  Aggregate,
  BarPlot,
  GroupBy,
  ScatterPlot,
  FileLoader,
  RenameColumns,
  DropColumns,
  Stats,
  Markdown,
  Filter,
  LinePlot,
  Sort,
  Replace,
} from './nodes';
import { NodeEdge } from './edge';

export const nodeTypes = {
  [NodeType.FileLoader]: FileLoader,
  [NodeType.ScatterPlot]: ScatterPlot,
  [NodeType.BarPlot]: BarPlot,
  [NodeType.GroupBy]: GroupBy,
  [NodeType.Aggregate]: Aggregate,
  [NodeType.RenameColumns]: RenameColumns,
  [NodeType.DropColumns]: DropColumns,
  [NodeType.Stats]: Stats,
  [NodeType.Markdown]: Markdown,
  [NodeType.Filter]: Filter,
  [NodeType.LinePlot]: LinePlot,
  [NodeType.Sort]: Sort,
  [NodeType.Replace]: Replace,
};

export const edgeTypes = {
  defaultEdge: NodeEdge,
};

export enum NodeGroupName {
  Input = 'input',
  Transform = 'transform',
  Visualize = 'visualize',
}

export type NodeConfigItem = {
  type: NodeType;
  group: NodeGroupName;
  title: string;
  description: string;
  input: string[];
  output: string[];
};

export const nodeGroupNameToTitle: Record<NodeGroupName, string> = {
  [NodeGroupName.Input]: 'Input',
  [NodeGroupName.Transform]: 'Transform',
  [NodeGroupName.Visualize]: 'Visualize',
};

export const nodeConfig: NodeConfigItem[] = [
  {
    type: NodeType.FileLoader,
    group: NodeGroupName.Input,
    title: 'File',
    description: 'Handles csv files',
    input: ['-'],
    output: ['Table'],
  },
  {
    type: NodeType.GroupBy,
    group: NodeGroupName.Transform,
    title: 'Group by',
    description: 'Group a data set based on given column name',
    input: ['Table'],
    output: ['Object'],
  },
  {
    type: NodeType.Aggregate,
    group: NodeGroupName.Transform,
    title: 'Aggregate',
    description: 'Apply given aggregation function to each object property value',
    input: ['Object'],
    output: ['Object'],
  },
  {
    type: NodeType.RenameColumns,
    group: NodeGroupName.Transform,
    title: 'Rename columns',
    description: 'Change multiple columns name',
    input: ['Table'],
    output: ['Table'],
  },
  {
    type: NodeType.DropColumns,
    group: NodeGroupName.Transform,
    title: 'Drop columns',
    description: 'Drop selected columns',
    input: ['Table'],
    output: ['Table'],
  },
  {
    type: NodeType.Filter,
    group: NodeGroupName.Transform,
    title: 'Filter',
    description: 'Filters column data based on given condition',
    input: ['Table'],
    output: ['Table'],
  },
  {
    type: NodeType.Sort,
    group: NodeGroupName.Transform,
    title: 'Sort',
    description: 'Sort data based on selected column and order',
    input: ['Table'],
    output: ['Table'],
  },
  {
    type: NodeType.Replace,
    group: NodeGroupName.Transform,
    title: 'Replace',
    description: 'Replace value based on selected column and pattern',
    input: ['Table'],
    output: ['Table'],
  },
  {
    type: NodeType.ScatterPlot,
    group: NodeGroupName.Visualize,
    title: 'Scatter plot',
    description: 'Display a scatterplot of given x and y column names',
    input: ['Table'],
    output: ['Table'],
  },
  {
    type: NodeType.LinePlot,
    group: NodeGroupName.Visualize,
    title: 'Line plot',
    description: 'Display a line plot of given x and y column names',
    input: ['Table', 'Object'],
    output: ['Table', 'Object'],
  },
  {
    type: NodeType.BarPlot,
    group: NodeGroupName.Visualize,
    title: 'Bar plot',
    description: 'Display bar chart',
    input: ['Object'],
    output: ['Object'],
  },
  {
    type: NodeType.Stats,
    group: NodeGroupName.Visualize,
    title: 'Stats',
    description: 'Display common statistical characteristics',
    input: ['Table'],
    output: ['Table'],
  },
  {
    type: NodeType.Markdown,
    group: NodeGroupName.Visualize,
    title: 'Markdown',
    description: 'Display user-written markdown',
    input: ['-'],
    output: ['-'],
  },
];
