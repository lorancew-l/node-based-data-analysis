import { useState } from 'react';
import { Button, lighten } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { AddBlockDialog } from './dialog';

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

type AddBlockButtonProps = {
  className?: string;
};

export const AddBlockButton: React.FC<AddBlockButtonProps> = ({ className }) => {
  const { classes, cx } = useStyles();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleDialogOpen = () => setIsDialogOpen(true);

  const handleDialogClose = () => setIsDialogOpen(false);

  return (
    <>
      <Button variant="outlined" className={cx(classes.button, className)} onClick={handleDialogOpen}>
        + block
      </Button>

      <AddBlockDialog open={isDialogOpen} onClose={handleDialogClose} />
    </>
  );
};
