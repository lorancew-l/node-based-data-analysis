import { useMemo, useState, memo } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ScatterChart, CartesianGrid, Scatter, XAxis, YAxis } from 'recharts';

import { NodeData, NodeIOTableData } from '../../../../types';
import { Select } from '../../../../components';
import { useReadonlyContext } from '../../readonly-context';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

type PlotProps = {
  data: NodeData<NodeIOTableData, NodeIOTableData>;
};

export const Plot: React.FC<PlotProps> = memo(({ data }) => {
  const { classes } = useStyles();

  const readonly = useReadonlyContext();

  const { input } = data;

  const { columns, data: rows } = input;

  const [xAxis, setXAxis] = useState<number>(0);
  const [yAxis, setYAxis] = useState<number>(0);

  const chartData = useMemo(() => {
    return rows.map((row) => ({ x: row[xAxis], y: row[yAxis] }));
  }, [data, xAxis, yAxis]);

  const options = columns.map((column, index) => ({ value: index, label: column }));

  return (
    <div className={classes.container}>
      <Select label="x-axis" value={xAxis} onChange={setXAxis} options={options} disabled={readonly} fullWidth />

      <Select label="y-axis" value={yAxis} onChange={setYAxis} options={options} disabled={readonly} fullWidth />

      <ScatterChart
        width={300}
        height={200}
        margin={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" name={columns[xAxis]} />
        <YAxis width={40} dataKey="y" type="number" name={columns[yAxis]} />
        <Scatter data={chartData} fill="#8884d8" />
      </ScatterChart>
    </div>
  );
});
