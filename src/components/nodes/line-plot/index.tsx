import { NodeProps } from 'reactflow';

import { BaseNode } from '../base-node';
import { NodeData, NodeIOData } from '../../../types';
import { makeStyles } from 'tss-react/mui';
import { isTableData } from '../../../utils/common';
import { TablePlot } from './table-plot';
import { ObjectPlot } from './object-plot';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

type LinePlotProps = NodeProps<NodeData<NodeIOData, NodeIOData>>;

export const LinePlot: React.FC<LinePlotProps> = ({ id, data, ...nodeProps }) => {
  const { classes } = useStyles();

  const { input } = data;
  const { columns } = input;

  const hasData = !!columns.length;

  return (
    <BaseNode id={id} title="Line plot" {...nodeProps} input>
      {hasData ? (
        <div className={classes.container}>{isTableData(input) ? <TablePlot data={input} /> : <ObjectPlot data={input} />}</div>
      ) : null}
    </BaseNode>
  );
};
