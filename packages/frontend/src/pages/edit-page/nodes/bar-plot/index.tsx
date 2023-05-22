import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOObjectData } from '../../../../types';
import { Plot } from './plot';
import { isEmpty } from 'lodash';

type InputData = Record<string, number>;
type BarPlotProps = NodeProps<NodeData<NodeIOObjectData<InputData>, NodeIOObjectData<InputData>>>;

export const BarPlot: React.FC<BarPlotProps> = ({ data, ...nodeProps }) => {
  const { input } = data;

  return (
    <BaseNode title="Столбчатая диаграмма" {...nodeProps} input>
      {!isEmpty(input.data) ? <Plot data={input.data} /> : null}
    </BaseNode>
  );
};
