import { NodeProps } from 'reactflow';
import { isEmpty } from 'lodash';
import { makeStyles } from 'tss-react/mui';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOTableData } from '../../../types';
import { StatsComponent } from './stats';

const useStyles = makeStyles()(() => ({
  container: {
    maxWidth: 250,
  },
}));

type StatsProps = NodeProps<NodeData<NodeIOTableData, NodeIOTableData>>;

export const Stats: React.FC<StatsProps> = ({ id, data, ...nodeProps }) => {
  const { classes } = useStyles();

  return (
    <BaseNode className={classes.container} id={id} title="Stats" {...nodeProps} input>
      {!isEmpty(data.input.data) ? <StatsComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
