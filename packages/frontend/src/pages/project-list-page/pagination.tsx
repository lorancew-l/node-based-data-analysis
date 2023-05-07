import { useMemo } from 'react';
import { Typography, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { makeStyles } from 'tss-react/mui';
import { Select } from '../../components';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: 52,
  },
  text: {
    fontSize: theme.typography.fontSize,
  },
  selectRoot: {
    marginLeft: 8,
    marginRight: 32,
  },
  select: {
    '&&&': {
      border: 'none',
      paddingBottom: 0,
      paddingTop: 0,
      fontSize: theme.typography.fontSize,
    },
  },
}));

type PaginationProps = {
  pageCount: number;
  totalCount: number;
  offset: number;
  page: number;
  offsetOptions: number[];
  onOffsetChange(offset: number): void;
  onPageChange(page: number): void;
};

export const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  totalCount,
  offset,
  page,
  offsetOptions,
  onOffsetChange,
  onPageChange,
}) => {
  const { classes } = useStyles();

  const options = useMemo(() => offsetOptions.map((option) => ({ label: String(option), value: option })), [offsetOptions]);

  const pageStartCount = (page - 1) * offset + 1;
  const pageEndCount = pageStartCount + pageCount - 1;

  const maxPage = Math.ceil(totalCount / offset);

  return (
    <div className={classes.container}>
      <Typography variant="body1">Строк на странице:</Typography>

      <Select
        className={classes.selectRoot}
        classes={{
          select: classes.select,
        }}
        size="small"
        variant="standard"
        value={offset}
        onChange={onOffsetChange}
        options={options}
        disableUnderline
      />

      <Typography className={classes.text} variant="body2">{`${pageStartCount}–${pageEndCount} из ${totalCount}`}</Typography>

      <IconButton size="small" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <KeyboardArrowLeftIcon />
      </IconButton>

      <IconButton size="small" onClick={() => onPageChange(page - 1)} disabled={page === maxPage}>
        <KeyboardArrowRightIcon />
      </IconButton>
    </div>
  );
};
