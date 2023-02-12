import { Connection, Handle, NodeProps, Position, useReactFlow } from 'reactflow';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { makeStyles } from 'tss-react/mui';
import { useAppDispatch } from '../../store/hooks';
import { removeNode } from '../../store/reducers/board';
import Typography from '@mui/material/Typography';
import { BoardNode, NodeData } from '../../types';

const useStyles = makeStyles<{ selected: boolean }>()((theme, { selected }) => ({
  container: {
    minWidth: 200,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.primary.dark}`,
  },
  handle: {
    width: 20,
    backgroundColor: selected ? theme.palette.primary.main : theme.palette.primary.dark,
    height: '100%',
    border: 'none',
  },
  rightHande: {
    right: -20,
    borderRadius: `0 ${1.5 * theme.shape.borderRadius}px ${1.5 * theme.shape.borderRadius}px 0`,
  },
  leftHande: {
    left: -20,
    borderRadius: `${1.5 * theme.shape.borderRadius}px 0 0 ${1.5 * theme.shape.borderRadius}px`,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.primary.dark}`,
    padding: theme.spacing(1),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(-1),
  },
  body: {
    padding: theme.spacing(1),
  },
  icon: {
    width: 20,
    height: 20,
    '& svg': {
      width: 16,
      height: 16,
    },
  },
}));

type BaseNodeProps = {
  title: string;
  children: React.ReactNode;
  input?: boolean;
  className?: string;
} & Pick<NodeProps, 'selected' | 'id'>;

export const BaseNode: React.FC<BaseNodeProps> = ({ id, title, children, selected, input, className }) => {
  const { classes, cx } = useStyles({ selected });

  const dispatch = useAppDispatch();
  const { getNodes } = useReactFlow<NodeData>();

  const handleRemove = () => {
    dispatch(removeNode(id));
  };

  const isValidConnection = (connection: Connection) => {
    const nodes = getNodes();

    const source = nodes.find(({ id }) => id === connection.source);
    const target = nodes.find(({ id }) => id === connection.target);

    return source.data.outputType.some((nodeType) => target.data.inputType.includes(nodeType));
  };

  return (
    <div className={cx(classes.container, className, 'baseNode')}>
      <div className={classes.content}>
        <div className={classes.header}>
          <div className={classes.title}>
            <DragIndicatorIcon color="action" />

            <Typography variant="body1">{title}</Typography>
          </div>

          <IconButton className={classes.icon} onClick={handleRemove}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classes.body}>{children}</div>
      </div>

      {input && (
        <Handle
          type="target"
          position={Position.Left}
          className={cx(classes.handle, classes.leftHande)}
          isValidConnection={isValidConnection}
        />
      )}

      <Handle
        type="source"
        position={Position.Right}
        className={cx(classes.handle, classes.rightHande)}
        isValidConnection={isValidConnection}
      />
    </div>
  );
};
