import { memo } from 'react';
import { LineChart, CartesianGrid, Line, XAxis, YAxis } from 'recharts';

type PlotProps = {
  chartData: { x: number | string; y: number | string }[];
};

export const Plot: React.FC<PlotProps> = memo(({ chartData }) => {
  return (
    <LineChart width={300} height={200} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" />
      <YAxis dataKey="y" type="number" tickFormatter={(label) => label.toFixed(1)} />
      <Line type="monotone" stroke="#8884d8" dataKey="y" dot={false} strokeWidth={2} />
    </LineChart>
  );
});
