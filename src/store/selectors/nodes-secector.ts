import { BoardNode } from '../../types';
import { AppState } from '../types';

export const selectNodes = (state: AppState) => state.board.nodes;

export const selectEdges = (state: AppState) => state.board.edges;

export const selectSelectedNodeData = (state: AppState) => state.board.nodes.find(({ selected }) => selected)?.data;

export const getNodeById = (nodeId: BoardNode['id']) => (state: AppState) => state.board.nodes.find(({ id }) => id === nodeId);
