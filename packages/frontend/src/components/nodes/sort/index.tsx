import { NodeProps } from 'reactflow';
import { isEmpty } from 'lodash';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOObjectData } from '../../../types';
import { SortComponent } from './sort';

type SortProps = NodeProps<NodeData<NodeIOObjectData, NodeIOObjectData>>;

export const Sort: React.FC<SortProps> = ({ id, data, ...nodeProps }) => {
  return (
    <BaseNode id={id} title="Sort" {...nodeProps} input>
      {!isEmpty(data.input.data) ? <SortComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
