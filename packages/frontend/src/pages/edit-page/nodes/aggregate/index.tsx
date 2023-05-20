import { NodeProps } from 'reactflow';
import { isEmpty } from 'lodash';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOObjectData } from '../../../../types';
import { AggregateComponent } from './aggregate';

type AggregateProps = NodeProps<NodeData<NodeIOObjectData, NodeIOObjectData>>;

export const Aggregate: React.FC<AggregateProps> = ({ id, data, ...nodeProps }) => {
  return (
    <BaseNode id={id} title="Агрегировать" {...nodeProps} input>
      {!isEmpty(data.input.data) ? <AggregateComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
