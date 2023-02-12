import { memo } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

type PlotProps = {
  data: Record<string, number>;
};

export const Plot: React.FC<PlotProps> = memo(({ data }) => {
  const { classes } = useStyles();
  const theme = useTheme();

  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className={classes.container}>
      <ResponsiveContainer width={350} height={200}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" tickFormatter={(label) => label.toFixed(1)} />
          <Bar dataKey="value" fill={theme.palette.primary.dark} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
