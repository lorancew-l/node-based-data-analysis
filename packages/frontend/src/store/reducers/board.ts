import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { applyNodeChanges, NodeChange, Edge, EdgeChange, applyEdgeChanges, Connection, addEdge } from 'reactflow';
import { v4 as makeId } from 'uuid';
import { cloneDeep } from 'lodash';

import { BoardNode, Dependencies, SavedAppState } from '../../types';
import { createNode, transformNodeData } from '../../utils/node';

type BoardState = {
  nodes: BoardNode[];
  edges: Edge[];
  dependencies: Dependencies;
};

const initialState: BoardState = {
  nodes: [],
  edges: [],
  dependencies: {},
};

const updateNodeDependents = ({
  source,
  nodes,
  dependencies,
}: {
  source: string;
  nodes: BoardNode[];
  dependencies: Dependencies;
}) => {
  const newNodes = cloneDeep(nodes);

  const update = (source: string) => {
    const { data } = newNodes.find(({ id }) => id === source) as BoardNode;
    const { output } = data;

    const sourceDependencies = dependencies[source] ?? [];

    sourceDependencies.forEach((dependency) => {
      const dependedNode = newNodes.find(({ id }) => id === dependency) as BoardNode;

      dependedNode.data.input = output;
      dependedNode.data.output = transformNodeData(dependedNode.type, dependedNode.data.input, dependedNode.data.params);

      update(dependedNode.id);
    });
  };

  update(source);

  return newNodes;
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
      const { dependencies, nodes } = state;
      const removedNodeId = action.payload;

      let newNodes = cloneDeep(nodes);
      const removedNode = newNodes.find(({ id }) => id === removedNodeId);

      if (!removedNode) {
        return;
      }

      const { input, output } = createNode(removedNode.type).data;
      removedNode.data = { ...removedNode.data, input, output, params: {} };

      newNodes = updateNodeDependents({ source: removedNodeId, nodes: newNodes, dependencies });
      newNodes = newNodes.filter((node) => node.id !== removedNodeId);

      delete state.dependencies[removedNodeId];
      state.nodes = newNodes;
      state.dependencies = Object.entries(state.dependencies).reduce<Dependencies>((result, [nodeId, dependencies]) => {
        result[nodeId] = dependencies.filter((dependency) => dependency !== removedNodeId);
        return result;
      }, {});
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

      if (!node) {
        return;
      }

      const { input, output } = createNode(node.type).data;
      node.data = { ...node.data, input, output, params: {} };
    },
    updateDependents: (state, action: PayloadAction<Connection['source']>) => {
      const source = action.payload;

      if (!source) {
        return;
      }

      const { nodes, dependencies } = state;

      state.nodes = updateNodeDependents({ source, nodes, dependencies });
    },
    reset: (state, action: PayloadAction<SavedAppState>) => {
      const { dependencies, reactFlow } = action.payload;

      state.nodes = reactFlow.nodes;
      state.edges = reactFlow.edges;
      state.dependencies = dependencies;
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
  reset,
} = boardSlice.actions;
