import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { boardReducer } from './reducers';
import { projectReducer } from './reducers/project';

export const rootReducer = combineReducers({
  board: boardReducer,
  project: projectReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
