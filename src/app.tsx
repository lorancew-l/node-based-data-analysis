import { makeStyles } from 'tss-react/mui';

import { Board } from './components/board';
import { Output } from './components/output';
import { AddBlockButton } from './components/add-block-dialog/add-block-button';
import { ReactFlowProvider } from 'reactflow';
import { RendererContextProvider } from './components/renderer-context';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
  },
  addBlockButton: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: theme.spacing(1.5),
    zIndex: theme.zIndex.appBar,
  },
}));

export const App = () => {
  const { classes } = useStyles();

  return (
    <main className={classes.container}>
      <RendererContextProvider>
        <ReactFlowProvider>
          <AddBlockButton className={classes.addBlockButton} />
          <Board />
          <Output />
        </ReactFlowProvider>
      </RendererContextProvider>
    </main>
  );
};
