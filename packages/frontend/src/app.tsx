import { useState, useLayoutEffect, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { makeStyles } from 'tss-react/mui';

import { Board } from './components/board';
import { Output } from './components/output';
import { AddBlockButton } from './components/add-block-dialog/add-block-button';
import { SaveButton } from './components/save-dialog/save-button';
import { RendererContextProvider } from './components/renderer-context';
import { TopBar } from './components/top-bar/top-bar';

const useStyles = makeStyles()((theme) => ({
  container: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  addBlockButton: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: theme.spacing(1.5),
    zIndex: theme.zIndex.appBar,
  },
  saveButtonGroup: {
    position: 'absolute',
    top: theme.spacing(1.5),
    right: theme.spacing(1.5),
    zIndex: theme.zIndex.appBar,
  },
}));

export const App = () => {
  const { classes } = useStyles();

  const [outputHeight, setOutputHeight] = useState<number>(250);

  const [topBar, setTopBar] = useState<number>(0);
  const headerRef = useRef<HTMLElement>();

  useLayoutEffect(() => {
    const { height } = headerRef.current.getBoundingClientRect();
    setTopBar(height);
  }, []);

  return (
    <main className={classes.container}>
      <RendererContextProvider>
        <ReactFlowProvider>
          <TopBar ref={headerRef} />
          <AddBlockButton className={classes.addBlockButton} />
          <SaveButton className={classes.saveButtonGroup} />
          <Board height={`calc(100vh - ${outputHeight + topBar}px)`} />
          <Output height={outputHeight} setHeight={setOutputHeight} />
        </ReactFlowProvider>
      </RendererContextProvider>
    </main>
  );
};
