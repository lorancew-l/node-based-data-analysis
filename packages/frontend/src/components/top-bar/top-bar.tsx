import { forwardRef } from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  header: {
    height: 60,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.default,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
  },
}));

type TopBarProps = {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
};

export const TopBar = forwardRef<HTMLElement, TopBarProps>(({ className, children }, ref) => {
  const { classes, cx } = useStyles();

  return (
    <header ref={ref} className={cx(classes.header, className)}>
      {children}
    </header>
  );
});
