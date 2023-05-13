import { Avatar, Paper, Grid, TextField, Button, Typography, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { Link as RRLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';
import { makeStyles } from 'tss-react/mui';
import { useSignInRequest, TokenResponse, SignInUser } from '../../api';
import { useAuthContext } from '../../auth-context';

const useStyles = makeStyles()((theme) => ({
  background: {
    paddingTop: 120,
    width: '100vw',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 400,
    padding: theme.spacing(3, 2),
    margin: '0 auto',
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
}));

export const SignInPage = () => {
  const { classes } = useStyles();

  const { register, handleSubmit, setError, formState } = useForm<SignInUser>({
    mode: 'onBlur',
    shouldUseNativeValidation: false,
    reValidateMode: 'onChange',
    defaultValues: {
      password: '',
      email: '',
    },
  });

  const { errors } = formState;

  const navigate = useNavigate();

  const location = useLocation();

  const { setTokens } = useAuthContext();

  const { signInUser, isLoading } = useSignInRequest({
    onSuccess: (tokens: TokenResponse) => {
      setTokens(tokens);
      navigate(location?.state?.from ?? '/edit');
    },
    onError: (status) => {
      if (status === 401) {
        setError('email', { message: 'Некорректный email или пароль' });
      }
    },
  });

  return (
    <div className={classes.background}>
      <form onSubmit={handleSubmit(signInUser)} noValidate>
        <Paper className={classes.container} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography className={classes.title} component="h1" variant="h5">
            Вход
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                {...register('email', { required: 'Обязательное поле' })}
                error={!!errors.email}
                helperText={errors.email?.message}
                label="Email"
                type="email"
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('password', { required: 'Обязательное поле' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                label="Пароль"
                type="password"
                required
                fullWidth
              />
            </Grid>
          </Grid>

          <Button
            startIcon={isLoading ? <CircularProgress color="info" size={16} /> : undefined}
            className={classes.button}
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
          >
            Войти
          </Button>

          <Link component={RRLink} to="/signup" variant="body2">
            Нет аккаунта? Зарегистрируйтесь
          </Link>
        </Paper>
      </form>
    </div>
  );
};
