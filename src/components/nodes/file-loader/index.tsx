import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { FileLoaderComponent } from './file-loader';

export const FileLoader: React.FC<NodeProps> = ({ id, data, ...nodeProps }) => {
  return (
    <BaseNode id={id} title="File" {...nodeProps}>
      <FileLoaderComponent id={id} data={data} />
    </BaseNode>
  );
};
