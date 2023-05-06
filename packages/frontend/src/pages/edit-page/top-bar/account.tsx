import { makeStyles } from 'tss-react/mui';
import { useNavigate } from 'react-router';
import { IconButton, Avatar, Tooltip } from '@mui/material';

import { Menu } from '../../../components';
import { useAuthContext, useUser } from '../../../auth-context';
import { useLogoutRequest } from '../../../api';

const useStyles = makeStyles()((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    backgroundColor: theme.palette.primary.main,
  },
  iconButton: {
    padding: 0,
  },
}));

enum AccountOptions {
  SignUp,
  SignIn,
  Logout,
}

type AccountProps = {};

export const Account: React.FC<AccountProps> = () => {
  const { classes } = useStyles();

  const user = useUser();

  const navigate = useNavigate();

  const { removeTokens } = useAuthContext();
  const { logout } = useLogoutRequest();

  const options = [
    ...(user
      ? [{ label: 'Выйти', value: AccountOptions.Logout }]
      : [
          { label: 'Войти', value: AccountOptions.SignIn },
          { label: 'Зарегистрироваться', value: AccountOptions.SignUp },
        ]),
  ];

  const handleOptionSelect = (option: AccountOptions) => {
    switch (option) {
      case AccountOptions.SignIn:
        return navigate('/signin');
      case AccountOptions.SignUp:
        return navigate('/signup');
      case AccountOptions.Logout: {
        logout();
        removeTokens();
        return navigate('/signin');
      }
      default:
        break;
    }
  };

  return (
    <Menu
      options={options}
      onSelect={handleOptionSelect}
      renderTrigger={(onClick) => (
        <Tooltip title="Открыть настройки">
          <IconButton className={classes.iconButton} onClick={onClick}>
            <Avatar className={classes.avatar}>{user?.firstName?.[0] ?? 'A'}</Avatar>
          </IconButton>
        </Tooltip>
      )}
    ></Menu>
  );
};
