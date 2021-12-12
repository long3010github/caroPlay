// import createSlice and type definition
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from './interface';

// define Message interface

// Define a type for the slice state
interface ChatState {
  messages: Message[];
}

const maxStoreLength = 100;

// Define the initial state using that type
const initialState: ChatState = {
  messages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.messages.length === maxStoreLength) {
        state.messages.pop();
      }
      state.messages.unshift(action.payload);
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
});

export const { addMessage } = chatSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default chatSlice.reducer;
