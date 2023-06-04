import { NodeType } from '../../types';
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
  HistPlot,
  PieChart,
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
  [NodeType.HistPlot]: HistPlot,
  [NodeType.PieChart]: PieChart,
};

export const edgeTypes = {
  defaultEdge: NodeEdge,
};

export enum NodeGroupName {
  Input = 'input',
  Transform = 'transform',
  Visualize = 'visualize',
  Other = 'other',
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
  [NodeGroupName.Input]: 'Вход',
  [NodeGroupName.Transform]: 'Преобразование',
  [NodeGroupName.Visualize]: 'Визуализация',
  [NodeGroupName.Other]: 'Другое',
};

export const nodeConfig: NodeConfigItem[] = [
  {
    type: NodeType.FileLoader,
    group: NodeGroupName.Input,
    title: 'Файл',
    description: 'Отвечает за загрузку данных',
    input: ['-'],
    output: ['Таблица'],
  },
  {
    type: NodeType.GroupBy,
    group: NodeGroupName.Transform,
    title: 'Группировать',
    description: 'Группирует данные на основе переданной колонки',
    input: ['Таблица'],
    output: ['Объект'],
  },
  {
    type: NodeType.Aggregate,
    group: NodeGroupName.Transform,
    title: 'Агрегировать',
    description: 'Применяет агрегирующую функцию к набору данных',
    input: ['Объект'],
    output: ['Объект'],
  },
  {
    type: NodeType.RenameColumns,
    group: NodeGroupName.Transform,
    title: 'Переименовать колонки',
    description: 'Переименовывает колонки',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.DropColumns,
    group: NodeGroupName.Transform,
    title: 'Удалить колонки',
    description: 'Удаляет выбранные колонки',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.Filter,
    group: NodeGroupName.Transform,
    title: 'Фильтр',
    description: 'Фильтрует данные в зависимости от выбранного условия',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.Sort,
    group: NodeGroupName.Transform,
    title: 'Сортировать',
    description: 'Сортирует данные в выбранной колонке по условию',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.Replace,
    group: NodeGroupName.Transform,
    title: 'Заменить',
    description: 'Заменяет данные в выбранной колонке по шаблону',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.ScatterPlot,
    group: NodeGroupName.Visualize,
    title: 'Диаграмма рассеяния',
    description: 'Строит диаграмму рассеяния',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.LinePlot,
    group: NodeGroupName.Visualize,
    title: 'Линейный график',
    description: 'Строит линейный график',
    input: ['Таблица', 'Объект'],
    output: ['Таблица', 'Объект'],
  },
  {
    type: NodeType.BarPlot,
    group: NodeGroupName.Visualize,
    title: 'Столбчатая диаграмма',
    description: 'Строит столбчатую диаграмму',
    input: ['Объект'],
    output: ['Объект'],
  },
  {
    type: NodeType.Stats,
    group: NodeGroupName.Other,
    title: 'Статистика',
    description: 'Отображает основные стат. характеристики',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.Markdown,
    group: NodeGroupName.Other,
    title: 'Комментарий',
    description: 'Отображает пользовательский текст',
    input: ['-'],
    output: ['-'],
  },
  {
    type: NodeType.HistPlot,
    group: NodeGroupName.Visualize,
    title: 'Гистограмма',
    description: 'Строит гистограмму по выбранной колонке',
    input: ['Таблица'],
    output: ['Таблица'],
  },
  {
    type: NodeType.PieChart,
    group: NodeGroupName.Visualize,
    title: 'Круговая диаграмма',
    description: 'Строит круговую диаграмму',
    input: ['Объект'],
    output: ['Объект'],
  },
];
