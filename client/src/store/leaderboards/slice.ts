// import createSlice and type definition
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILeaderBoard } from '../../interface';

const initialState: ILeaderBoard[] = [];

export const leaderBoardsSlice = createSlice({
  name: 'leaderBoards',
  initialState,
  reducers: {
    setLeaderBoards: (state, action: PayloadAction<ILeaderBoard[]>) => [
      ...action.payload,
    ],
  },
});

export const { setLeaderBoards } = leaderBoardsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default leaderBoardsSlice.reducer;
