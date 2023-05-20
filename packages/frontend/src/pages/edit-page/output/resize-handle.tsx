import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  handle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: 14,
    cursor: 'row-resize',
    userSelect: 'none',
    borderTop: `1px solid ${theme.palette.primary.main}`,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.default,
  },
}));

const MIN_HEIGHT = 150;
type ResizeHandleProps = {
  setHeight(height: number): void;
};

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ setHeight }) => {
  const { classes } = useStyles();

  const resizeSidebar = () => {
    const continueResize = (event: MouseEvent) => {
      const newHeight = window.innerHeight - event.clientY;
      if (newHeight > MIN_HEIGHT && newHeight < window.innerHeight / 2) {
        setHeight(newHeight);
      }
    };

    const endResize = () => {
      document.body.removeEventListener('mousemove', continueResize);
      document.body.removeEventListener('mouseup', endResize);
    };

    document.body.addEventListener('mouseup', endResize);
    document.body.addEventListener('mousemove', continueResize);
  };

  return (
    <div className={classes.handle} onMouseDown={resizeSidebar}>
      =
    </div>
  );
};
