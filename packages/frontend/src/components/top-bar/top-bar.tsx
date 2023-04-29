import { forwardRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import Avatar from '@mui/material/Avatar';

const useStyles = makeStyles()((theme) => ({
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

type TopBarProps = {};

export const TopBar = forwardRef<HTMLElement, TopBarProps>(({}, ref) => {
  const { classes } = useStyles();

  return (
    <header ref={ref} className={classes.header}>
      <Avatar></Avatar>
    </header>
  );
});
