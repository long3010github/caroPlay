// import createSlice and type definition
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface TimerType {
  remain: number;
  isActive: boolean;
}
// Define a type for the slice state
interface TimerState {
  matchStart: TimerType;
  matchMove: TimerType;
  matchFinish: TimerType;
}

// Define the initial state using that type
const initialState: TimerState = {
  matchStart: {
    remain: 3,
    isActive: false,
  },
  matchMove: {
    remain: 15,
    isActive: false,
  },
  matchFinish: {
    remain: 5,
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
      action: PayloadAction<{
        type: 'matchStart' | 'matchMove' | 'matchFinish';
        remain: number;
      }>
    ) => {
      const { type, remain } = action.payload;
      state[type] = { ...initialState[type], isActive: true, remain };
    },
    setTimerAfterTick: (
      state,
      action: PayloadAction<'matchStart' | 'matchMove' | 'matchFinish'>
    ) => {
      const type = action.payload;
      // state[type].remain -= 1;
      // console.log(state[type].remain);
      if (state[type].remain === 1) {
        state[type].isActive = false;
        return;
      }
      state[type].remain -= 1;
    },
    resetTimer: (state) => ({
      ...initialState,
    }),
  },
});

export const { setActiveTimer, setTimerAfterTick, resetTimer } =
  timerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default timerSlice.reducer;
