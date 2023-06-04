import { useMemo, memo } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Chart } from 'react-google-charts';
import { useTheme } from '@mui/material/styles';

import { NodeData, NodeIOTableData } from '../../../../types';
import { Select } from '../../../../components';
import { useReadonlyContext } from '../../readonly-context';
import { updateNodeById, useAppDispatch } from '../../../../store';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

type PlotProps = {
  id: string;
  data: NodeData<NodeIOTableData, NodeIOTableData>;
};

export const Plot: React.FC<PlotProps> = memo(({ id, data }) => {
  const { classes } = useStyles();

  const readonly = useReadonlyContext();

  const { input, params } = data;

  const { columns, data: rows } = input;

  const { column = null } = params;

  const chartData = useMemo(() => {
    if (!column || !rows?.length) {
      return [];
    }

    return rows.map((row) => [row[column], row[column]]);
  }, [rows, column]);

  const columnOptions = columns.map((column, index) => ({ value: index, label: column }));

  const dispatch = useAppDispatch();

  const handleColumnChange = (column: number) => dispatch(updateNodeById({ id, data: { params: { column } } }));

  const theme = useTheme();

  const options = {
    legend: { position: 'none' },
    backgroundColor: theme.palette.background.paper,
    colors: [theme.palette.primary.dark],
    chartArea: { width: '80%', height: '80%' },
    vAxis: {
      gridlines: {
        color: 'rgb(102,102,102)',
      },
      minorGridlines: {
        color: 'rgb(102,102,102)',
      },
      textStyle: {
        color: 'rgb(102,102,102)',
      },
    },
    hAxis: {
      textStyle: {
        color: 'rgb(102,102,102)',
      },
    },
  };

  return (
    <div className={classes.container}>
      <Select
        label="Колонка"
        value={column}
        onChange={handleColumnChange}
        options={columnOptions}
        disabled={readonly}
        fullWidth
      />

      {!!chartData?.length && <Chart chartType="Histogram" width="300px" data={chartData} options={options} />}
    </div>
  );
});
