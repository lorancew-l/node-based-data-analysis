import { store, rootReducer } from './store';

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppState = ReturnType<typeof rootReducer>;
