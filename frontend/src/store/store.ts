import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/taskSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['tasks/setFilters'],
        ignoredPaths: ['tasks.filters.dateFrom', 'tasks.filters.dateTo'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;