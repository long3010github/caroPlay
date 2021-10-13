// import createSlice and type definition
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from '@reduxjs/toolkit/node_modules/immer/dist/internal';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import type { RootState } from '../index';
import { IOType } from './ioType';

// Define a type for the slice state
interface SocketState {
  // [x: string]: Socket | undefined;
  chat?: Socket;
  game?: Socket;
  logger?: Socket;
}

// Define the initial state using that type
const initialState: SocketState = {
  chat: undefined,
  game: undefined,
  logger: undefined,
};

export const socketSlice = createSlice({
  name: 'socket',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSocketInstance: (
      state,
      action: PayloadAction<{ ioType: IOType; ioInstance: Socket }>
    ) => ({
      ...state,
      [action.payload.ioType]: action.payload.ioInstance,
    }),
    // clearSocketInstance: (state) => ({
    //   chat
    // }),
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
});

export const { setSocketInstance } = socketSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default socketSlice.reducer;
