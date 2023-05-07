import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOObjectData, NodeIOTableData } from '../../../../types';
import { GroupByComponent } from './group-by';

type GroupByProps = NodeProps<NodeData<NodeIOTableData, NodeIOObjectData>>;

export const GroupBy: React.FC<GroupByProps> = ({ id, data, ...nodeProps }) => {
  return (
    <BaseNode id={id} title="Group by" {...nodeProps} input>
      {!!data.input.columns.length ? <GroupByComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
