import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { selectSelectedNodeData } from '../../store/selectors/nodes-secector';
import { OutputTable } from './table';
import { isTableData } from '../../utils/common';
import { ObjectViewer } from './object-viewer';

const useStyles = makeStyles()((theme) => ({
  container: {
    height: '35%',
    borderTop: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1, 0, 1, 1),
  },
}));

export const Output = () => {
  const { classes } = useStyles();

  const selectedNodeData = useSelector(selectSelectedNodeData);
  const data = selectedNodeData?.output;

  if (!data?.columns) {
    return <div className={classes.container} />;
  }

  return (
    <div className={classes.container}>{isTableData(data) ? <OutputTable data={data} /> : <ObjectViewer data={data.data} />}</div>
  );
};
