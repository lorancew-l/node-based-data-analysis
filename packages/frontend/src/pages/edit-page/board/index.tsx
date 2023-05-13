import { useCallback, useEffect } from 'react';
import ReactFlow, { Background, Connection, Controls, EdgeChange, NodeChange, MiniMap } from 'reactflow';
import { useTheme, alpha, lighten } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import 'reactflow/dist/style.css';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { connectNodes, updateDependents, updateEdges, updateNodes } from '../../../store/reducers/board';
import { selectEdges, selectNodes } from '../../../store/selectors/node-selectors';
import { nodeTypes, edgeTypes } from '../node-config';
import { useRendererContext } from '../renderer-context';
import { useReadonlyContext } from '../readonly-context';
import { reset } from '../../../store';
import { SavedAppState } from '../../../types';

const useStyles = makeStyles<{ height: string | number }>()((theme, { height }) => ({
  container: {
    width: '100%',
    height: height,
  },
  background: {
    backgroundColor: theme.palette.background.default,
  },
  controls: {
    button: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: lighten(theme.palette.background.paper, 0.15),
      },
    },
    path: {
      fill: theme.palette.primary.main,
    },
  },
}));

const proOptions = { hideAttribution: true };

const readonlyProps = {
  nodesDraggable: false,
  nodesConnectable: false,
};

const defaultAppState: SavedAppState = {
  dependencies: {},
  reactFlow: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
};

type BoardProps = {
  height: string | number;
};

export const Board: React.FC<BoardProps> = ({ height }) => {
  const { classes } = useStyles({ height });
  const theme = useTheme();

  const readonly = useReadonlyContext();

  const rendererRef = useRendererContext();

  const nodes = useAppSelector(selectNodes);
  const edges = useAppSelector(selectEdges);

  const dispatch = useAppDispatch();

  const handleNodesChange = useCallback((changes: NodeChange[]) => dispatch(updateNodes(changes)), []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => dispatch(updateEdges(changes)), []);

  const handleConnect = useCallback((connection: Connection) => {
    dispatch(connectNodes(connection));
    dispatch(updateDependents(connection.source));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(reset(defaultAppState));
    };
  }, []);

  return (
    <div className={classes.container}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={handleConnect}
        proOptions={proOptions}
        ref={rendererRef}
        {...(readonly && readonlyProps)}
      >
        <Background size={2} color={theme.palette.background.paper} className={classes.background} />

        <Controls className={classes.controls} showInteractive={!readonly} />

        <MiniMap
          className={classes.background}
          nodeColor={theme.palette.background.paper}
          maskColor={alpha(lighten(theme.palette.background.default, 0.04), 0.6)}
        />
      </ReactFlow>
    </div>
  );
};
