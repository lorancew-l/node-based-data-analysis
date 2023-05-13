import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    WebkitJustifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    color: theme.palette.common.white,
    fontSize: '64px',
  },
  button: {
    margin: '0 auto',
    marginTop: theme.spacing(2),
  },
}));

export const Page403 = () => {
  const { classes } = useStyles();

  const navigate = useNavigate();

  const navigateToHomePage = () => navigate('/edit');

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Typography variant="h1">403</Typography>

        <Typography variant="h6">Вы не можете просматривать эту страницу</Typography>

        <Button onClick={navigateToHomePage} className={classes.button} variant="contained">
          Вернутся на главную
        </Button>
      </div>
    </div>
  );
};
