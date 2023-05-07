import { AppState } from '../types';

export const selectProject = (state: AppState) => state.project?.project;

export const selectProjectTitle = (state: AppState) => state.project?.project?.title;

export const selectProjectId = (state: AppState) => state.project?.project?.id;
