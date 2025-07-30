import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { MAX_COLS, MIN_ROWS } from '../config/constants';

interface OperationsState {
  rows: number;
  columns: number;
  sortColumn: string | null;
  sortAscending: boolean;
}

const initialState: OperationsState = {
  rows: 100,
  columns: 26,
  sortColumn: null,
  sortAscending: true,
};

const operationsSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {
    addRow(state) {
      state.rows += 1;
    },
    deleteRow(state) {
      if (state.rows > MIN_ROWS) state.rows -= 1;
    },
    addColumn(state) {
      if (state.columns < MAX_COLS) state.columns += 1;
    },
    deleteColumn(state) {
      if (state.columns > 1) state.columns -= 1;
    },
    // New actions for inserting/deleting at specific positions
    insertRowAfter(state, _action: PayloadAction<number>) {
      if (state.rows < 1000) {
        state.rows += 1;
      }
    },
    deleteRowAt(state, _action: PayloadAction<number>) {
      if (state.rows > MIN_ROWS) {
        state.rows -= 1;
      }
    },
    insertColumnAfter(state, _action: PayloadAction<string>) {
      if (state.columns < MAX_COLS) {
        state.columns += 1;
      }
    },
    deleteColumnAt(state, _action: PayloadAction<string>) {
      if (state.columns > 1) {
        state.columns -= 1;
      }
    },
    setSort(state, action: PayloadAction<{ column: string; ascending: boolean }>) {
      state.sortColumn = action.payload.column;
      state.sortAscending = action.payload.ascending;
    },
    setDimensions(state, action: PayloadAction<{ rows: number; columns: number }>) {
      state.rows = action.payload.rows;
      state.columns = action.payload.columns;
    },
    resetOperations(state) {
      state.rows = 100;
      state.columns = 26;
      state.sortColumn = null;
      state.sortAscending = true;
    },
  },
});

export const { 
  addRow, 
  deleteRow, 
  addColumn, 
  deleteColumn, 
  insertRowAfter,
  deleteRowAt,
  insertColumnAfter,
  deleteColumnAt,
  setSort,
  setDimensions,
  resetOperations 
} = operationsSlice.actions;
export default operationsSlice.reducer;
