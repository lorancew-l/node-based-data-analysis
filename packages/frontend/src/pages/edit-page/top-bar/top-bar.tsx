import { forwardRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Typography, Link } from '@mui/material';
import { Link as RRLink } from 'react-router-dom';
import { Account } from './account';
import { FileOptions } from './file-options';
import { useAppSelector } from '../../../store';
import { selectProjectTitle } from '../../../store/selectors/project-selector';

const useStyles = makeStyles()((theme) => ({
  logo: {
    marginRight: theme.spacing(1.5),
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
  projectTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  account: {
    marginLeft: 'auto',
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

type TopBarProps = {};

export const TopBar = forwardRef<HTMLElement, TopBarProps>(({}, ref) => {
  const { classes } = useStyles();

  const title = useAppSelector(selectProjectTitle);

  return (
    <header ref={ref} className={classes.header}>
      <FileOptions className={classes.logo} />

      <Link component={RRLink} to={`/projects`} variant="body2">
        Проекты
      </Link>

      <Typography variant="body1" className={classes.projectTitle} color="primary">
        {title ?? 'Без названия'}
      </Typography>

      <Account />
    </header>
  );
});
