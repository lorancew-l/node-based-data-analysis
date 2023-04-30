import { useState } from 'react';
import { Menu as MUIMenu, MenuItem, Typography } from '@mui/material';
import { isString } from 'lodash';

type MenuProps<T extends string | number> = {
  options: string[] | { label: string; value: T }[];
  onSelect(value: T): void;
  renderTrigger: (onClick: (event: React.MouseEvent<HTMLElement>) => void) => React.ReactNode;
};

export const Menu = <T extends string | number>({ options, onSelect, renderTrigger }: MenuProps<T>) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  const handleMenuOptionClick = (option: T) => {
    onSelect(option);
    handleCloseMenu();
  };

  return (
    <>
      {renderTrigger(handleOpenMenu)}

      <MUIMenu
        id="menu"
        anchorEl={anchorElement}
        open={!!anchorElement}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {options.map((option) => {
          const label = isString(option) ? option : option.label;
          const value = isString(option) ? (option as T) : option.value;

          return (
            <MenuItem key={value} onClick={() => handleMenuOptionClick(value)}>
              <Typography>{label}</Typography>
            </MenuItem>
          );
        })}
      </MUIMenu>
    </>
  );
};
