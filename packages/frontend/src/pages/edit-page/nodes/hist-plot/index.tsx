import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOTableData } from '../../../../types';
import { Plot } from './plot';

type HistPlotProps = NodeProps<NodeData<NodeIOTableData, NodeIOTableData>>;

export const HistPlot: React.FC<HistPlotProps> = ({ id, data, ...nodeProps }) => {
  const { input } = data;

  return (
    <BaseNode id={id} title="Гистограмма" {...nodeProps} input>
      {!!input?.columns?.length ? <Plot id={id} data={data} /> : null}
    </BaseNode>
  );
};
