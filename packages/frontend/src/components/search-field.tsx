import { makeStyles } from 'tss-react/mui';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCallback, useState } from 'react';
import { debounce } from 'lodash';

const useStyles = makeStyles()((theme) => ({
  textField: {
    width: 200,
    transition: '0.2s',
  },
  focused: {
    width: 400,
  },
  input: {
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
  },
}));

type SearchFieldProps = {
  className?: string;
  defaultValue: string;
  onChange(text: string): void;
};

export const SearchField = ({ defaultValue, onChange, className }: SearchFieldProps) => {
  const { classes, cx } = useStyles();

  const [isFocused, setIsFocused] = useState(false);

  const handleSearchTextChange = useCallback(
    debounce(({ target }: React.ChangeEvent<HTMLInputElement>) => {
      onChange(target.value);
    }, 500),
    [],
  );

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  return (
    <TextField
      InputProps={{
        inputProps: {
          className: classes.input,
        },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
      className={cx(classes.textField, className, { [classes.focused]: isFocused })}
      defaultValue={defaultValue}
      onChange={handleSearchTextChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      variant="outlined"
      size="small"
    />
  );
};
