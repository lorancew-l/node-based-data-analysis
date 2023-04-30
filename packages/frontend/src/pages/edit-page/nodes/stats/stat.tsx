import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
}));

type StatProps = {
  label: string;
  value: number;
};

export const Stat: React.FC<StatProps> = ({ label, value }) => {
  const { classes } = useStyles();

  return (
    <span className={classes.container}>
      <Typography variant="body2">{label}</Typography>

      <Typography variant="body2">{value?.toFixed(3)}</Typography>
    </span>
  );
};
