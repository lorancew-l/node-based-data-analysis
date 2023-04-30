import { useMemo, useState, memo } from 'react';

import { NodeIOTableData } from '../../../../types';
import { Select } from '../../../../components';
import { Plot } from './plot';

type PlotProps = {
  data: NodeIOTableData;
};

export const TablePlot: React.FC<PlotProps> = memo(({ data }) => {
  const { columns, data: rows } = data;

  const [xAxis, setXAxis] = useState<number>(0);
  const [yAxis, setYAxis] = useState<number>(0);

  const chartData = useMemo(() => {
    return rows.map((row) => ({ x: row[xAxis], y: row[yAxis] }));
  }, [data, xAxis, yAxis]);

  const options = columns.map((column, index) => ({ value: index, label: column }));

  return (
    <>
      <Select label="x-axis" value={xAxis} onChange={setXAxis} options={options} fullWidth />

      <Select label="y-axis" value={yAxis} onChange={setYAxis} options={options} fullWidth />

      <Plot chartData={chartData} />
    </>
  );
});
