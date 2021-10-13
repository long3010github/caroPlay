import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/slice';
import { modalSlide } from './Modal/slice';
import { socketSlice } from './socket/slice';
// ...

export const store = configureStore({
  reducer: {
    modal: modalSlide.reducer,
    auth: authSlice.reducer,
    socket: socketSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
