import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { type GridState, type CellData } from "../types/grid.types";
import { demoCells } from "../data/demoData";
import { DEFAULT_ROWS, DEFAULT_COLUMNS } from "../config/constants";
import { switchSheet } from "./sheetsSlice";
import { recordChange } from "./historySlice";
import type { HistoryEntry } from "../types";
import type { RootState } from "./index";

// Thunk for updating cell with history tracking
export const updateCellWithHistory = createAsyncThunk(
  'grid/updateCellWithHistory',
  async (
    { cellRef, value, formula, skipHistory = false }: {
      cellRef: string;
      value: string | number | null;
      formula?: string;
      skipHistory?: boolean;
    },
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;
    const oldCell = state.grid.cells[cellRef];
    
    // Record history entry (unless skipping for undo/redo operations)
    if (!skipHistory) {
      const historyEntry: HistoryEntry = {
        cellRef,
        oldValue: oldCell?.value ?? null,
        newValue: value,
        oldFormula: oldCell?.formula,
        newFormula: formula,
        userId: state.auth.user?.username ?? 'anonymous',
        timestamp: Date.now(),
      };
      dispatch(recordChange(historyEntry));
    }
    
    return { cellRef, value, formula };
  }
);

const initialState: GridState = {
  rows: DEFAULT_ROWS,
  columns: DEFAULT_COLUMNS,
  cells: demoCells,
  visibleRange: {
    rows: [1, 20],
    cols: [0, 10],
  },
};

/**
 * Manages cell values, formulas, dimensions, and current grid viewport state.
 */
const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    updateCell(
      state,
      action: PayloadAction<{ cellRef: string; value: string | number | null; formula?: string }>
    ) {
      const { cellRef, value, formula } = action.payload;
      state.cells[cellRef] = { value, ...(formula && { formula }) };
    },
    setVisibleRange(
      state,
      action: PayloadAction<{ rows: [number, number]; cols: [number, number] }>
    ) {
      state.visibleRange = action.payload;
    },
    setDimensions(
      state,
      action: PayloadAction<{ rows: number; columns: number }>
    ) {
      state.rows = action.payload.rows;
      state.columns = action.payload.columns;
    },
    resetGrid(state) {
      state.cells = {};
    },
    loadSheetCells(state, action: PayloadAction<Record<string, CellData>>) {
      state.cells = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(switchSheet, (state) => {
      // When switching sheets, we'll update the grid cells in a selector or middleware
      // For now, we reset the cells - the actual data will be loaded by the components
      state.cells = {};
    });
    builder.addCase(updateCellWithHistory.fulfilled, (state, action) => {
      const { cellRef, value, formula } = action.payload;
      state.cells[cellRef] = { value, ...(formula && { formula }) };
    });
  },
});

export const { updateCell, setVisibleRange, setDimensions, resetGrid, loadSheetCells } = gridSlice.actions;
export default gridSlice.reducer;
