import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ErrorState {
  currentError: string | null;
}

const initialState: ErrorState = {
  currentError: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string>) {
      state.currentError = action.payload;
    },
    clearError(state) {
      state.currentError = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
