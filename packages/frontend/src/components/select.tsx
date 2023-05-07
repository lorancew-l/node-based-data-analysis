import { useState } from 'react';
import {
  MenuItem,
  Select as MUISelect,
  SelectProps as MUISelectProps,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from '@mui/material';
import { noop } from 'lodash';

type SelectOptionValue = string | number | '';

export type Option<T extends SelectOptionValue> = { value: T; label: string };

export type SelectProps<T extends SelectOptionValue> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  disabledOptions?: T[];
} & Omit<MUISelectProps<T>, 'value' | 'onChange'>;

export const Select = <T extends SelectOptionValue>({
  value,
  onChange,
  options,
  label,
  fullWidth,
  inputProps,
  disabledOptions,
  multiple,
  size = 'small',
  disabled,
  ...props
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  const handleChange = (event: SelectChangeEvent<T>) => {
    onChange(event.target.value as typeof value);
  };

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      {label && <InputLabel id="select">{label}</InputLabel>}
      <MUISelect
        {...props}
        labelId="select"
        label={label}
        value={value}
        open={isOpen}
        onClick={disabled ? noop : handleClick}
        onChange={handleChange}
        fullWidth={fullWidth}
        multiple={multiple}
        disabled={disabled}
      >
        {options.map(({ value, label }) => (
          <MenuItem key={label} value={value} disabled={disabledOptions?.includes(value)}>
            {label}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
};
