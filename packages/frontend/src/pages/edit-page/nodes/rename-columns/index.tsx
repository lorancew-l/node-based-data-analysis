import { NodeProps } from 'reactflow';
import { isEmpty } from 'lodash';
import { makeStyles } from 'tss-react/mui';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOTableData } from '../../../../types';
import { RenameColumnsComponent } from './rename-columns';

const useStyles = makeStyles()(() => ({
  container: {
    width: 300,
  },
}));

type RenameColumnsProps = NodeProps<NodeData<NodeIOTableData, NodeIOTableData>>;

export const RenameColumns: React.FC<RenameColumnsProps> = ({ id, data, ...nodeProps }) => {
  const { classes } = useStyles();
  return (
    <BaseNode className={classes.container} id={id} title="Переименовать колонки" {...nodeProps} input>
      {!isEmpty(data.input.data) ? <RenameColumnsComponent id={id} data={data} /> : null}
    </BaseNode>
  );
};
