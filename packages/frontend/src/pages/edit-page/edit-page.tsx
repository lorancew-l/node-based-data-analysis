import { useState, useLayoutEffect, useRef } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { CircularProgress, Backdrop } from '@mui/material';
import { useParams } from 'react-router';
import { makeStyles } from 'tss-react/mui';

import { Board } from './board';
import { Output } from './output';
import { RendererContextProvider } from './renderer-context';
import { EditPageTopBar } from './top-bar/top-bar';
import { AddBlockButton } from './add-block-dialog/add-block-button';
import { useLoadProject } from './use-load-project';
import { ReadonlyContextProvider } from './readonly-context';

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
  loader: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
  },
  backdrop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: theme.zIndex.modal,
  },
}));

type EditPageProps = {
  readonly: boolean;
};

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
      <Backdrop open={isLoading} className={classes.backdrop}>
        <CircularProgress />
      </Backdrop>

      <RendererContextProvider>
        <EditPageTopBar ref={headerRef} />
        <AddBlockButton className={classes.addBlockButton} />
        <Board height={`calc(100vh - ${outputHeight + topBarHeight}px)`} />
        <Output height={outputHeight} setHeight={setOutputHeight} />
      </RendererContextProvider>
    </main>
  );
};

export const EditPage: React.FC<EditPageProps> = ({ readonly }) => {
  return (
    <ReadonlyContextProvider readonly={readonly}>
      <ReactFlowProvider>
        <EditPageComponent />
      </ReactFlowProvider>
    </ReadonlyContextProvider>
  );
};
