import { useState, useLayoutEffect, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useParams } from 'react-router';
import { makeStyles } from 'tss-react/mui';

import { Board } from './board';
import { Output } from './output';
import { RendererContextProvider } from './renderer-context';
import { TopBar } from './top-bar/top-bar';
import { AddBlockButton } from './add-block-dialog/add-block-button';
import { useLoadProject } from './use-load-project';

const useStyles = makeStyles<{ topBarHeight: number }>()((theme, { topBarHeight }) => ({
  container: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  addBlockButton: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: `calc(${topBarHeight}px + ${theme.spacing(1.5)})`,
    zIndex: theme.zIndex.appBar,
  },
}));

const EditPageComponent = () => {
  const [outputHeight, setOutputHeight] = useState<number>(250);

  const [topBarHeight, setTopBarHeight] = useState<number>(0);
  const headerRef = useRef<HTMLElement>();

  const { classes } = useStyles({ topBarHeight });

  const { projectId } = useParams();

  const { isLoading } = useLoadProject(projectId);

  useLayoutEffect(() => {
    const { height } = headerRef.current.getBoundingClientRect();
    setTopBarHeight(height);
  }, []);

  return (
    <main className={classes.container}>
      <RendererContextProvider>
        <TopBar ref={headerRef} />
        <AddBlockButton className={classes.addBlockButton} />
        <Board height={`calc(100vh - ${outputHeight + topBarHeight}px)`} />
        <Output height={outputHeight} setHeight={setOutputHeight} />
      </RendererContextProvider>
    </main>
  );
};

export const EditPage = () => {
  return (
    <ReactFlowProvider>
      <EditPageComponent />
    </ReactFlowProvider>
  );
};
