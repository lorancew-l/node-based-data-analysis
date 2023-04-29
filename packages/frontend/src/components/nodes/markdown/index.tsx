import { NodeProps } from 'reactflow';

import { NodeData, NodeIOObjectData, NodeIOTableData } from '../../../types';
import { MarkdownComponent } from './markdown';

type MarkdownProps = NodeProps<NodeData<NodeIOTableData, NodeIOObjectData>>;

export const Markdown: React.FC<MarkdownProps> = ({ id, data, ...nodeProps }) => {
  return (
    <div>
      <MarkdownComponent id={id} data={data} />
    </div>
  );
};
