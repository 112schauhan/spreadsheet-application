import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { HistoryEntry, HistoryState } from '../types';
import type { RootState } from './index';
import { updateCell } from './gridSlice';

// Thunk for undo operation
export const undoAction = createAsyncThunk(
  'history/undoAction',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { past } = state.history;
    
    if (past.length === 0) return null;
    
    const lastEntry = past[past.length - 1];
    
    // Update the grid state
    dispatch(updateCell({
      cellRef: lastEntry.cellRef,
      value: lastEntry.oldValue,
      formula: lastEntry.oldFormula
    }));
    
    return lastEntry;
  }
);

// Thunk for redo operation
export const redoAction = createAsyncThunk(
  'history/redoAction',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { future } = state.history;
    
    if (future.length === 0) return null;
    
    const nextEntry = future[future.length - 1];
    
    // Update the grid state
    dispatch(updateCell({
      cellRef: nextEntry.cellRef,
      value: nextEntry.newValue,
      formula: nextEntry.newFormula
    }));
    
    return nextEntry;
  }
);

const initialState: HistoryState = {
  past: [],
  future: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    recordChange(state, action: PayloadAction<HistoryEntry>) {
      state.past.push(action.payload);
      state.future = []; // Clear future on new action
    },
    clearHistory(state) {
      state.past = [];
      state.future = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(undoAction.fulfilled, (state, action) => {
        if (action.payload && state.past.length > 0) {
          const last = state.past.pop()!;
          state.future.push(last);
        }
      })
      .addCase(redoAction.fulfilled, (state, action) => {
        if (action.payload && state.future.length > 0) {
          const next = state.future.pop()!;
          state.past.push(next);
        }
      });
  },
});

export const { recordChange, clearHistory } = historySlice.actions;
// Keep the old action names for compatibility, but they now point to thunks
export const undo = undoAction;
export const redo = redoAction;
export default historySlice.reducer;