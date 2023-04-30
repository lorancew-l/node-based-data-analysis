import React from 'react';
import { getBezierPath, EdgeProps } from 'reactflow';
import { IconButton, lighten } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { makeStyles } from 'tss-react/mui';
import { useAppDispatch } from '../../store/hooks';
import { removeEdge, updateDependents, resetNodeData } from '../../store/reducers/board';

const foreignObjectSize = 30;

const useStyles = makeStyles()((theme) => ({
  button: {
    width: foreignObjectSize,
    height: foreignObjectSize,
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: lighten(theme.palette.background.paper, 0.1),
    },
    '& svg': {
      width: 16,
      height: 16,
    },
  },
}));

export const NodeEdge: React.FC<EdgeProps> = ({
  id,
  target,
  source,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  const { classes } = useStyles();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const dispatch = useAppDispatch();

  const handleRemoveEdge = () => {
    dispatch(removeEdge({ id, source, target }));
    dispatch(resetNodeData(target));
    dispatch(updateDependents(target));
  };

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />

      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <IconButton className={classes.button} onClick={handleRemoveEdge}>
          <CloseIcon />
        </IconButton>
      </foreignObject>
    </>
  );
};
