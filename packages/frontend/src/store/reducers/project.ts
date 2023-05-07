import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Project } from '../../api';
import { omit } from 'lodash';

type ProjectState = {
  project: Omit<Project, 'data'> | null;
};

const initialState: ProjectState = {
  project: null,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state, action: PayloadAction<Project>) => {
      state.project = omit(action.payload, 'data');
    },
  },
});

export const projectReducer = projectSlice.reducer;
export const { setProject } = projectSlice.actions;
