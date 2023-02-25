import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { applyNodeChanges, NodeChange, Edge, EdgeChange, applyEdgeChanges, Connection, addEdge } from 'reactflow';
import { v4 as makeId } from 'uuid';

import { BoardNode } from '../../types';
import { createNode, transformNodeData } from '../../utils/node';
import { edges, nodes, dependencies } from './demo';

type Dependencies = Record<string, string[]>;

type BoadrdState = {
  nodes: BoardNode[];
  edges: Edge[];
  dependencies: Dependencies;
};

const initialState: BoadrdState = {
  nodes: nodes,
  edges: edges,
  dependencies: dependencies,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Pick<BoardNode, 'type' | 'position'>>) => {
      const { type, position } = action.payload;

      const node = createNode(type, position);
      state.nodes.push(node);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
    },
    updateNodes: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes) as BoardNode[];
    },
    updateNodeById: (state, action: PayloadAction<{ id: string; data: Partial<BoardNode['data']> }>) => {
      const { id, data } = action.payload;

      const nodeToUpdate = state.nodes.find((node) => node.id === id) as BoardNode;
      const updatedNodeData = { ...nodeToUpdate.data, ...data };
      updatedNodeData.output = transformNodeData(nodeToUpdate.type, updatedNodeData.input, updatedNodeData.params);

      state.nodes = state.nodes.map((node) => (node.id === id ? { ...node, data: updatedNodeData } : node));
    },
    updateEdges: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    connectNodes: (state, action: PayloadAction<Connection>) => {
      const { source, target } = action.payload;

      state.edges = addEdge({ id: makeId(), ...action.payload, animated: true, type: 'defaultEdge' }, state.edges);
      if (target && source) {
        const dependencies = state.dependencies[source] ?? [];
        state.dependencies[source] = [...dependencies, target];
      }
    },
    removeEdge: (state, action: PayloadAction<{ id: BoardNode['id']; target: BoardNode['id']; source: BoardNode['id'] }>) => {
      const { id, source, target } = action.payload;

      state.edges = state.edges.filter((edge) => edge.id !== id);
      state.dependencies[source] = state.dependencies[source].filter((dependency) => dependency !== target);
    },
    resetNodeData: (state, action: PayloadAction<BoardNode['id']>) => {
      const node = state.nodes.find(({ id }) => id === action.payload);

      const { input, output } = createNode(node.type).data;
      node.data = { ...node.data, input, output, params: {} };
    },
    updateDependents: (state, action: PayloadAction<Connection['source']>) => {
      const source = action.payload;

      if (!source) {
        return;
      }

      const update = (source: string) => {
        const { data } = state.nodes.find(({ id }) => id === source) as BoardNode;
        const { output } = data;

        const dependencies = state.dependencies[source] ?? [];

        dependencies.forEach((dependency) => {
          const dependedNode = state.nodes.find(({ id }) => id === dependency) as BoardNode;

          dependedNode.data.input = output;
          dependedNode.data.output = transformNodeData(dependedNode.type, dependedNode.data.input, dependedNode.data.params);

          update(dependedNode.id);
        });
      };

      update(source);
    },
  },
});

export const boardReducer = boardSlice.reducer;
export const {
  addNode,
  removeNode,
  updateNodes,
  updateNodeById,
  updateEdges,
  connectNodes,
  updateDependents,
  removeEdge,
  resetNodeData,
} = boardSlice.actions;
