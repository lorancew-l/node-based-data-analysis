import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOObjectData } from '../../../../types';
import { Plot } from './plot';

type HistPlotProps = NodeProps<NodeData<NodeIOObjectData, NodeIOObjectData>>;

export const PieChart: React.FC<HistPlotProps> = ({ id, data, ...nodeProps }) => {
  const { input } = data;

  return (
    <BaseNode id={id} title="Круговая диаграмма" {...nodeProps} input>
      {!!input?.columns?.length ? <Plot data={data} /> : null}
    </BaseNode>
  );
};
