import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOObjectData, NodeIOTableData } from '../../../types';
import { FilterComponent } from './filter';

type FilterProps = NodeProps<NodeData<NodeIOTableData, NodeIOObjectData>>;

export const Filter: React.FC<FilterProps> = ({ id, data, ...nodeProps }) => {
  return (
    <BaseNode id={id} title="Filter" {...nodeProps} input>
      {!!data.input.columns.length ? <FilterComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
