import { useMemo, memo } from 'react';

import { NodeIOObjectData } from '../../../../types';
import { Plot } from './plot';

type ObjectPlotProps = {
  data: NodeIOObjectData;
};

export const ObjectPlot: React.FC<ObjectPlotProps> = memo(({ data }) => {
  const { data: objectData } = data;

  const chartData = useMemo(() => {
    return Object.entries(objectData).map(([x, y]) => ({ x, y }));
  }, [data]);

  return <Plot chartData={chartData} />;
});
