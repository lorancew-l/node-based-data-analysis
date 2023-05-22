import { NodeProps } from 'reactflow';
import { isEmpty } from 'lodash';
import { makeStyles } from 'tss-react/mui';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOObjectData } from '../../../../types';
import { DropColumnsComponent } from './drop-columns';

const useStyles = makeStyles()(() => ({
  container: {
    maxWidth: 250,
  },
}));

type DropColumnsProps = NodeProps<NodeData<NodeIOObjectData, NodeIOObjectData>>;

export const DropColumns: React.FC<DropColumnsProps> = ({ id, data, ...nodeProps }) => {
  const { classes } = useStyles();
  return (
    <BaseNode className={classes.container} id={id} title="Удалить колонки" {...nodeProps} input>
      {!isEmpty(data.input.data) ? <DropColumnsComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
