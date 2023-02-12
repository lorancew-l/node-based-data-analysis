import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOTableData } from '../../../types';
import { Plot } from './plot';

type ScatterPlotProps = NodeProps<NodeData<NodeIOTableData, NodeIOTableData>>;

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ id, data, ...nodeProps }) => {
  const { input } = data;

  return (
    <BaseNode id={id} title="Scatter plot" {...nodeProps} input>
      {!!input?.columns?.length ? <Plot data={data} /> : null}
    </BaseNode>
  );
};
