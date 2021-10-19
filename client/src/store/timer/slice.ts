// import createSlice and type definition
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface TimerType {
  time: number;
  isActive: boolean;
}
// Define a type for the slice state
interface TimerState {
  matchStart: TimerType;
  matchMove: TimerType;
}

// Define the initial state using that type
const initialState: TimerState = {
  matchStart: {
    time: 3,
    isActive: false,
  },
  matchMove: {
    time: 15,
    isActive: false,
  },
};

export const timerSlice = createSlice({
  name: 'timer',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setActiveTimer: (
      state,
      action: PayloadAction<'matchStart' | 'matchMove'>
    ) => {
      const type = action.payload;
      state[type] = { ...initialState[type], isActive: true };
    },
    setTimerAfterTick: (
      state,
      action: PayloadAction<'matchStart' | 'matchMove'>
    ) => {
      const type = action.payload;
      state[type].time -= 1;
      if (state[type].time === 0) state[type].isActive = false;
    },
    resetTimer: (state) => ({
      ...initialState,
    }),
    // setMatchMoveTimerAfterTick: (state) => {
    //   state.matchMove.time -= 1;
    //   if (state.matchMove.time === 0) state.matchMove.isActive = false;
    // },
    // setTimerCountdown: (state) => ({
    //   ...state,
    //   type: {
    //     ...state.type,
    //     time,
    //   },
    // }),
    // clearUser: (state) => ({
    //   isAuth: false,
    // }),
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
});

export const { setActiveTimer, setTimerAfterTick, resetTimer } =
  timerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default timerSlice.reducer;
