import { Avatar, Paper, Grid, TextField, Button, Link, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Link as RRLink } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { useSignUpRequest, SignUpUser, TokenResponse } from '../../api';
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

export const SignUpPage = () => {
  const { classes } = useStyles();

  const { register, handleSubmit, setError, formState } = useForm<SignUpUser>({
    mode: 'onBlur',
    shouldUseNativeValidation: false,
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
    },
  });
  const navigate = useNavigate();

  const { errors } = formState;

  const { setTokens } = useAuthContext();

  console.log(errors);

  const { signUpUser, isLoading } = useSignUpRequest({
    onSuccess: (tokens: TokenResponse) => {
      setTokens(tokens);
      navigate('/edit');
    },
    onError: (status) => {
      if (status === 401) {
        setError('email', { message: 'Этот email уже занят' });
      }
    },
  });

  return (
    <div className={classes.background}>
      <form onSubmit={handleSubmit(signUpUser)} noValidate>
        <Paper className={classes.container} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography className={classes.title} component="h1" variant="h5">
            Регистрация
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('firstName', { required: 'Обязательное поле' })}
                helperText={errors.firstName?.message}
                error={!!errors.firstName}
                label="Имя"
                required
                fullWidth
                autoFocus
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                {...register('lastName', { required: 'Обязательное поле' })}
                helperText={errors.lastName?.message}
                error={!!errors.lastName}
                label="Фамилия"
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('email', { required: 'Обязательное поле' })}
                helperText={errors.email?.message}
                error={!!errors.email}
                label="Email"
                type="email"
                required
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register('password', { required: 'Обязательное поле' })}
                helperText={errors.password?.message}
                error={!!errors.password}
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
            Зарегистрироваться
          </Button>

          <Link component={RRLink} to="/signin" variant="body2">
            Уже есть аккаунт? Войдите
          </Link>
        </Paper>
      </form>
    </div>
  );
};
