import { useEffect, useMemo } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useGetUsersRequest } from '../../api';

const useStyles = makeStyles()(() => ({
  autocomplete: {
    minWidth: 200,
  },
}));

type Option = {
  value: string;
  label: string;
};

type UserAutocompleteFieldProps = {
  value: string;
  onChange(value: string): void;
};

export const UserAutocompleteField: React.FC<UserAutocompleteFieldProps> = ({ value, onChange }) => {
  const { classes } = useStyles();

  const { users, isLoading, getUsers } = useGetUsersRequest();

  const autocompleteOptions = useMemo(
    () =>
      (users || []).map(({ firstName, lastName, id }) => ({
        label: `${firstName} ${lastName}`,
        value: id,
      })),
    [users],
  );

  const handleChange = (_: any, option: Option | null) => {
    onChange(option?.value ?? null);
  };

  const selectedOption = useMemo(
    () => autocompleteOptions.find((option) => option.value === value) || null,
    [autocompleteOptions, value],
  );

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Autocomplete
      noOptionsText="Нет пользователей"
      className={classes.autocomplete}
      inputValue={selectedOption?.label ?? ''}
      loading={isLoading}
      value={selectedOption}
      onChange={handleChange}
      options={autocompleteOptions}
      renderInput={(params) => <TextField {...params} label="Пользователь" size="small" />}
    />
  );
};
