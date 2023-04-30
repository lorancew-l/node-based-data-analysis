import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

import { selectSelectedNodeData } from '../../../store/selectors/node-selectors';
import { isTableData } from '../../../utils/common';
import { OutputTable } from './table';
import { ObjectViewer } from './object-viewer';
import { ResizeHandle } from './resize-handle';

const useStyles = makeStyles<{ height: number }>()((theme, { height }) => ({
  container: {
    width: '100%',
    height,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1, 0, 1, 1),
  },
}));

type OutputProps = {
  height: number;
  setHeight(height: number): void;
};

export const Output: React.FC<OutputProps> = ({ height, setHeight }) => {
  const { classes } = useStyles({ height });

  const selectedNodeData = useSelector(selectSelectedNodeData);
  const data = selectedNodeData?.output;

  return (
    <div>
      <ResizeHandle setHeight={setHeight} />
      <div className={classes.container}>
        {!data?.columns ? null : <>{isTableData(data) ? <OutputTable data={data} /> : <ObjectViewer data={data.data} />}</>}
      </div>
    </div>
  );
};
