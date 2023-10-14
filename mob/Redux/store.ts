import { configureStore } from '@reduxjs/toolkit';
import { scheduleApi } from './API/schedules.api.slice';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: {
    [scheduleApi.reducerPath] : scheduleApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(scheduleApi.middleware),

});

setupListeners(store.dispatch);

export default store;