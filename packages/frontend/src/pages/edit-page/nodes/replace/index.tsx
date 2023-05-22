import { NodeProps } from 'reactflow';
import { isEmpty } from 'lodash';
import { makeStyles } from 'tss-react/mui';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOTableData } from '../../../../types';
import { ReplaceComponent } from './replace';

const useStyles = makeStyles()(() => ({
  container: {
    width: 300,
  },
}));

type ReplaceProps = NodeProps<NodeData<NodeIOTableData, NodeIOTableData>>;

export const Replace: React.FC<ReplaceProps> = ({ id, data, ...nodeProps }) => {
  const { classes } = useStyles();

  return (
    <BaseNode className={classes.container} id={id} title="Заменить" {...nodeProps} input>
      {!isEmpty(data.input.data) ? <ReplaceComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
