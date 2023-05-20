import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { NodeGroupName } from '../node-config';

const useStyles = makeStyles()((theme) => ({
  icon: {
    width: 16,
  },
  sectionName: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0.5, 0.5, 0),
    gap: theme.spacing(1),
    cursor: 'pointer',
  },
  sectionNameTitle: {
    textTransform: 'uppercase',
    fontSize: theme.typography.fontSize * 0.9,
  },
  selected: {
    color: theme.palette.primary.main,
  },
}));

type SectionNameProps = {
  name: NodeGroupName;
  value: NodeGroupName;
  Icon: React.FC<{ className: string }>;
  onClick(value: NodeGroupName): void;
  children: React.ReactNode;
};

export const SectionName: React.FC<SectionNameProps> = ({ value, name, Icon, onClick, children }) => {
  const { cx, classes } = useStyles();

  const handleClick = () => onClick(name);

  return (
    <div className={cx(classes.sectionName, { [classes.selected]: value === name })} onClick={handleClick}>
      <Icon className={classes.icon} />

      <Typography className={classes.sectionNameTitle}>{children}</Typography>
    </div>
  );
};
