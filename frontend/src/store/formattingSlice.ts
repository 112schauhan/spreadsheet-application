import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CellFormatting } from '../types/formatting.types';

interface FormattingState {
  formats: Record<string, CellFormatting>;
}

const initialState: FormattingState = {
  formats: {},
};

const formattingSlice = createSlice({
  name: 'formatting',
  initialState,
  reducers: {
    setCellFormatting(state, action: PayloadAction<{ cellRef: string; formatting: CellFormatting }>) {
      state.formats[action.payload.cellRef] = {
        ...state.formats[action.payload.cellRef],
        ...action.payload.formatting,
      };
    },
    clearCellFormatting(state, action: PayloadAction<string>) {
      delete state.formats[action.payload];
    },
    clearAllFormatting(state) {
      state.formats = {};
    },
  },
});

export const { setCellFormatting, clearCellFormatting, clearAllFormatting } = formattingSlice.actions;
export default formattingSlice.reducer;