import { makeStyles } from 'tss-react/mui';
import { ProjectListTable } from './project-list-table';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100vw',
    margin: '0 auto',
  },
}));

export const ProjectListPage = () => {
  const { classes } = useStyles();

  return (
    <section className={classes.container}>
      <ProjectListTable />
    </section>
  );
};
