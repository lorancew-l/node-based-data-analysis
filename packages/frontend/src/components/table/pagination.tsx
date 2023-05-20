import { forwardRef, useMemo } from 'react';
import { Typography, IconButton } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { makeStyles } from 'tss-react/mui';
import { Select } from '../../components';

const useStyles = makeStyles()((theme) => ({
  container: {
    color: theme.palette.text.primary,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: 52,
    borderTop: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0, 1.5),
  },
  text: {
    fontSize: theme.typography.fontSize,
    margin: theme.spacing(0, 3),
  },
  selectRoot: {
    marginLeft: theme.spacing(1),
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
  totalCount: number;
  offset: number;
  page: number;
  offsetOptions: number[];
  onOffsetChange(offset: number): void;
  onPageChange(page: number): void;
};

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ totalCount, offset, page, offsetOptions, onOffsetChange, onPageChange }, ref) => {
    const { classes } = useStyles();

    const options = useMemo(() => offsetOptions.map((option) => ({ label: String(option), value: option })), [offsetOptions]);

    const maxPage = Math.ceil(totalCount / offset);

    const pageCount = page === maxPage ? totalCount - (page - 1) * offset : offset;

    const pageStartCount = totalCount === 0 ? 0 : (page - 1) * offset + 1;
    const pageEndCount = totalCount === 0 ? 0 : pageStartCount + pageCount - 1;

    return (
      <div className={classes.container} ref={ref}>
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

        <IconButton size="small" onClick={() => onPageChange(page - 1)} disabled={!totalCount || page === 1}>
          <KeyboardArrowLeftIcon />
        </IconButton>

        <IconButton size="small" onClick={() => onPageChange(page + 1)} disabled={!totalCount || page === maxPage}>
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    );
  },
);
