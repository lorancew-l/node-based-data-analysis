import { Button, lighten } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  button: {
    borderRadius: 5 * theme.shape.borderRadius,
    textTransform: 'none',
    zIndex: theme.zIndex.appBar,
    background: theme.palette.background.default,
    padding: theme.spacing(0.5, 1.5),
    '&:hover': {
      background: lighten(theme.palette.background.default, 0.1),
    },
  },
}));

type SaveButtonProps = {
  className?: string;
};

export const SaveButton: React.FC<SaveButtonProps> = ({ className }) => {
  const { classes } = useStyles();

  const handleSave = () => {};

  const handleLoad = () => {};

  return (
    <div className={className}>
      <Button variant="outlined" className={classes.button} onClick={handleSave}>
        Save
      </Button>

      <Button variant="outlined" className={classes.button} onClick={handleLoad}>
        Load
      </Button>
    </div>
  );
};
