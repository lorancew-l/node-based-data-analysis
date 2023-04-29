import { Edge, Node, Viewport } from 'reactflow';

export enum NodeType {
  FileLoader = 'fileLoader',
  ScatterPlot = 'scatterPlot',
  BarPlot = 'barPlot',
  GroupBy = 'groupBy',
  Aggregate = 'aggregate',
  RenameColumns = 'renameColumns',
  DropColumns = 'dropColumns',
  Stats = 'stats',
  Markdown = 'markdown',
  Filter = 'filter',
  LinePlot = 'linePlot',
  Sort = 'sort',
  Replace = 'replace',
}

export type NodeIOObjectData<T extends object = object> = {
  columns: string[];
  data: T;
};

export type NodeIOTableData = {
  columns: string[];
  data: string[][];
};

export enum IOType {
  Table = 'table',
  Object = 'object',
}

export type NodeIOData = NodeIOObjectData | NodeIOTableData;

export type NodeData<Input extends NodeIOData = NodeIOData, Output extends NodeIOData = NodeIOData> = {
  input?: Input;
  output?: Output;
  params?: any;
  inputType: IOType[];
  outputType: IOType[];
};

export type BoardNode = Node<NodeData, NodeType> & {
  type: NodeType;
};

export type AggregateFunction = (value: number[]) => number | undefined;

export enum AggregateFunctionName {
  Count = 'count',
  Mean = 'mean',
  Max = 'max',
  Min = 'min',
}

export enum DataType {
  Number = 'number',
  String = 'string',
}

export enum Filter {
  Equal = 'equal',
  NotEqual = 'notEqual',
  NumberGreater = 'numberGrater',
  NumberGreaterOrEqual = 'numberGreaterOrEqual',
  NumberLess = 'numberLess',
  NumberLessOrEqual = 'numberLessOrEqual',
  NotEmpty = 'notEmpty',
  Includes = 'stringIncludes',
  NotIncludes = 'stringNotIncludes',
}

export enum SortOrder {
  Ascending,
  Descending,
}

export enum ReplaceCondition {
  Contains = 'contains',
}

export type Dependencies = Record<BoardNode['id'], BoardNode['id'][]>;

export type SavedAppState = {
  reactFlow: {
    nodes: BoardNode[];
    edges: Edge[];
    viewport: Viewport;
  };
  dependencies: Dependencies;
};
