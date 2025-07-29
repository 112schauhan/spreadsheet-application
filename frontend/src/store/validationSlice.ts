import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ValidationState } from '../types';

const initialState: ValidationState = {
  errors: {},
};

const validationSlice = createSlice({
  name: 'validation',
  initialState,
  reducers: {
    setCellError(state, action: PayloadAction<{ cellRef: string; error: string }>) {
      state.errors[action.payload.cellRef] = action.payload.error;
    },
    clearCellError(state, action: PayloadAction<string>) {
      delete state.errors[action.payload];
    },
    clearAllErrors(state) {
      state.errors = {};
    },
  },
});

export const { setCellError, clearCellError, clearAllErrors } = validationSlice.actions;
export default validationSlice.reducer;