import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { boardReducer } from './reducers';

export const rootReducer = combineReducers({
  board: boardReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
