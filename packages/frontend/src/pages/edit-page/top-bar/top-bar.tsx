import { forwardRef } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Typography, Link } from '@mui/material';
import { Link as RRLink } from 'react-router-dom';
import { FileOptions } from './file-options';
import { useAppSelector } from '../../../store';
import { selectProjectTitle } from '../../../store/selectors/project-selector';
import { TopBar, Account } from '../../../components';

const useStyles = makeStyles()((theme) => ({
  logo: {
    marginRight: theme.spacing(2),
  },
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
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
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

type EditPageTopBarProps = {};

export const EditPageTopBar = forwardRef<HTMLElement, EditPageTopBarProps>(({}, ref) => {
  const { classes } = useStyles();

  const title = useAppSelector(selectProjectTitle);

  return (
    <TopBar ref={ref}>
      <FileOptions className={classes.logo} />

      <nav className={classes.nav}>
        <Link component={RRLink} to={'/my-projects'} variant="body2">
          Мои проекты
        </Link>

        <Link component={RRLink} to={'/projects'} variant="body2">
          Проекты
        </Link>
      </nav>

      <Typography variant="body2" className={classes.projectTitle} color="primary">
        {title ?? 'Без названия'}
      </Typography>

      <Account />
    </TopBar>
  );
});
