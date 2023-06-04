import { useMemo, memo } from 'react';
import { Chart } from 'react-google-charts';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

import { NodeData, NodeIOObjectData } from '../../../../types';

const useStyles = makeStyles()(() => ({
  container: {
    '& .google-visualization-tooltip': {
      pointerEvents: 'none',
    },
  },
}));

type PlotProps = {
  data: NodeData<NodeIOObjectData, NodeIOObjectData>;
};

export const Plot: React.FC<PlotProps> = memo(({ data }) => {
  const { classes } = useStyles();

  const { input } = data;

  const { data: objectData } = input;

  const chartData = useMemo(() => {
    if (!Object.values(objectData).length) {
      return [];
    }

    return [['', ''], ...Object.entries(objectData)];
  }, [objectData]);

  const theme = useTheme();

  const chartColors = [
    theme.palette.primary.dark,
    theme.palette.success.main,
    theme.palette.warning.light,
    theme.palette.error.light,
  ];

  const options = {
    backgroundColor: theme.palette.background.paper,
    colors: chartColors,
    chartArea: { width: '80%', height: '80%' },
    pieSliceTextStyle: {
      color: 'rgb(102,102,102)',
    },
    legend: {
      textStyle: {
        color: theme.palette.text.primary,
      },
    },
  };

  return (
    <div className={classes.container}>
      {!!chartData?.length ? <Chart chartType="PieChart" width="300px" data={chartData} options={options} /> : null}
    </div>
  );
});
