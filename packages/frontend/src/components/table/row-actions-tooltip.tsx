import { Tooltip, MenuItem } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  menuItem: {
    width: 32,
    height: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0.5,
  },
  popper: {
    padding: 0,
    margin: 0,
  },
  tooltip: {
    padding: theme.spacing(0, 0.5),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgb(97,97,97)',
    margin: 0,
    '&&&': {
      marginRight: theme.spacing(0.5),
    },
  },
}));

type Action = {
  id: string;
  icon: React.ReactNode;
  action(id: string): void;
};

type RowActionsTooltipProps = {
  id: string;
  actions: Action[];
};

export const RowActionsTooltip: React.FC<RowActionsTooltipProps> = ({ id, actions }) => {
  const { classes } = useStyles();

  return (
    <Tooltip
      classes={{
        tooltip: classes.tooltip,
        popper: classes.popper,
      }}
      placement="left"
      title={
        <span className={classes.container}>
          {actions.map((action) => (
            <MenuItem
              className={classes.menuItem}
              key={action.id}
              onClick={(e) => {
                e.stopPropagation();
                action.action(id);
              }}
            >
              {action.icon}
            </MenuItem>
          ))}
        </span>
      }
    >
      <MoreHorizIcon />
    </Tooltip>
  );
};
