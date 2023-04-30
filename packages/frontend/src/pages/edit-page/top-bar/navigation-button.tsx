import { Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  button: {
    textTransform: 'capitalize',
  },
}));

type NavigationButtonProps = {
  onClick(): void;
  children: React.ReactNode;
};

export const NavigationButton: React.FC<NavigationButtonProps> = ({ onClick, children }) => {
  const { classes } = useStyles();

  return (
    <Button className={classes.button} onClick={onClick}>
      {children}
    </Button>
  );
};
