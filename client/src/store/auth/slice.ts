// import createSlice and type definition
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userInfo } from 'os';
import type { RootState } from '../index';
import { UserInfo } from './interface';

// Define a type for the slice state
interface AuthState {
  isAuth: boolean;
  userInfo?: UserInfo;
}

// Define the initial state using that type
const initialState: AuthState = {
  isAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo>) => ({
      isAuth: true,
      userInfo: action.payload,
    }),
    clearUser: (state) => ({
      isAuth: false,
    }),
    updateAfterMatchFinish: (
      state,
      action: PayloadAction<{ win: number; lose: number; username: string }>
    ) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        ...action.payload,
      },
    }),
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
});

export const { setUser, clearUser, updateAfterMatchFinish } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default authSlice.reducer;
