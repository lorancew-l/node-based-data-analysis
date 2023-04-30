import { makeStyles } from 'tss-react/mui';
import { IconButton, Avatar, Tooltip } from '@mui/material';
import { Menu } from '../../../components';

const useStyles = makeStyles()((theme) => ({
  avatar: {
    height: 32,
    width: 32,
    backgroundColor: theme.palette.secondary.light,
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

  const options = [
    { label: 'Войти', value: AccountOptions.SignIn },
    { label: 'Зарегистрироваться', value: AccountOptions.SignUp },
    { label: 'Выйти', value: AccountOptions.Logout },
  ];

  const handleOptionSelect = (option: AccountOptions) => {
    switch (option) {
      case AccountOptions.SignIn:
        break;
      case AccountOptions.SignUp:
        break;
      case AccountOptions.Logout:
        break;
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
            <Avatar className={classes.avatar}>A</Avatar>
          </IconButton>
        </Tooltip>
      )}
    ></Menu>
  );
};
