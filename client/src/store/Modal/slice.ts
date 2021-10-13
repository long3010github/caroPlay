// import createSlice and type definition
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface ModalState {
  isShown: boolean;
  component?: JSX.Element;
}

// Define the initial state using that type
const initialState: ModalState = {
  isShown: false,
};

export const modalSlide = createSlice({
  name: 'modal',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    showWithComponent: (state, action: PayloadAction<JSX.Element>) => ({
      isShown: true,
      component: action.payload,
    }),
    hide: (state) => {
      state.isShown = false;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
  },
});

export const { showWithComponent, hide } = modalSlide.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default modalSlide.reducer;
