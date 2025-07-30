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
    sortData(state, action: PayloadAction<{ column: string; ascending: boolean }>) {
      const { column, ascending } = action.payload;
      
      // Get all row numbers that have data in the specified column
      const columnCells = Object.keys(state.cells)
        .filter(cellRef => cellRef.startsWith(column))
        .map(cellRef => ({
          cellRef,
          row: parseInt(cellRef.slice(column.length)),
          value: state.cells[cellRef]?.value
        }))
        .filter(item => item.value !== null && item.value !== undefined && item.value !== "")
        .sort((a, b) => {
          if (typeof a.value === 'number' && typeof b.value === 'number') {
            return ascending ? a.value - b.value : b.value - a.value;
          }
          const aStr = String(a.value || '').toLowerCase();
          const bStr = String(b.value || '').toLowerCase();
          return ascending ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
        });

      // Create a mapping of old rows to new rows
      const newCells: Record<string, CellData> = {};
      
      // Copy all cells first
      Object.keys(state.cells).forEach(cellRef => {
        newCells[cellRef] = { ...state.cells[cellRef] };
      });
      
      // Rearrange rows based on sort order
      columnCells.forEach((item, index) => {
        const oldRow = item.row;
        const newRow = index + 1;
        
        if (oldRow !== newRow) {
          // Move all cells in this row
          Object.keys(state.cells).forEach(cellRef => {
            const match = cellRef.match(/^([A-Z]+)(\d+)$/);
            if (match && parseInt(match[2]) === oldRow) {
              const col = match[1];
              const newCellRef = `${col}${newRow}`;
              newCells[newCellRef] = { ...state.cells[cellRef] };
              if (newCellRef !== cellRef) {
                delete newCells[cellRef];
              }
            }
          });
        }
      });
      
      state.cells = newCells;
    },
    // New actions for inserting and deleting rows/columns at specific positions
    insertRowAfter(state, action: PayloadAction<number>) {
      const afterRow = action.payload;
      const newCells: Record<string, CellData> = {};
      
      // Shift all rows after the insertion point down by 1
      Object.keys(state.cells).forEach(cellRef => {
        const match = cellRef.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          const col = match[1];
          const row = parseInt(match[2]);
          
          if (row > afterRow) {
            // Shift this cell down by 1 row
            const newCellRef = `${col}${row + 1}`;
            newCells[newCellRef] = { ...state.cells[cellRef] };
          } else {
            // Keep this cell in the same position
            newCells[cellRef] = { ...state.cells[cellRef] };
          }
        }
      });
      
      state.cells = newCells;
      state.rows += 1;
    },
    deleteRowAt(state, action: PayloadAction<number>) {
      const targetRow = action.payload;
      const newCells: Record<string, CellData> = {};
      
      // Remove all cells in the target row and shift cells below up
      Object.keys(state.cells).forEach(cellRef => {
        const match = cellRef.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          const col = match[1];
          const row = parseInt(match[2]);
          
          if (row === targetRow) {
            // Delete this cell (don't copy it)
            return;
          } else if (row > targetRow) {
            // Shift this cell up by 1 row
            const newCellRef = `${col}${row - 1}`;
            newCells[newCellRef] = { ...state.cells[cellRef] };
          } else {
            // Keep this cell in the same position
            newCells[cellRef] = { ...state.cells[cellRef] };
          }
        }
      });
      
      state.cells = newCells;
      if (state.rows > 1) {
        state.rows -= 1;
      }
    },
    insertColumnAfter(state, action: PayloadAction<string>) {
      const afterColumn = action.payload;
      const afterColIndex = afterColumn.charCodeAt(0) - 65; // Convert A=0, B=1, etc.
      const newCells: Record<string, CellData> = {};
      
      // Shift all columns after the insertion point right by 1
      Object.keys(state.cells).forEach(cellRef => {
        const match = cellRef.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          const col = match[1];
          const row = match[2];
          const colIndex = col.charCodeAt(0) - 65;
          
          if (colIndex > afterColIndex) {
            // Shift this cell right by 1 column
            const newCol = String.fromCharCode(65 + colIndex + 1);
            const newCellRef = `${newCol}${row}`;
            newCells[newCellRef] = { ...state.cells[cellRef] };
          } else {
            // Keep this cell in the same position
            newCells[cellRef] = { ...state.cells[cellRef] };
          }
        }
      });
      
      state.cells = newCells;
      state.columns += 1;
    },
    deleteColumnAt(state, action: PayloadAction<string>) {
      const targetColumn = action.payload;
      const targetColIndex = targetColumn.charCodeAt(0) - 65; // Convert A=0, B=1, etc.
      const newCells: Record<string, CellData> = {};
      
      // Remove all cells in the target column and shift cells to the right left
      Object.keys(state.cells).forEach(cellRef => {
        const match = cellRef.match(/^([A-Z]+)(\d+)$/);
        if (match) {
          const col = match[1];
          const row = match[2];
          const colIndex = col.charCodeAt(0) - 65;
          
          if (colIndex === targetColIndex) {
            // Delete this cell (don't copy it)
            return;
          } else if (colIndex > targetColIndex) {
            // Shift this cell left by 1 column
            const newCol = String.fromCharCode(65 + colIndex - 1);
            const newCellRef = `${newCol}${row}`;
            newCells[newCellRef] = { ...state.cells[cellRef] };
          } else {
            // Keep this cell in the same position
            newCells[cellRef] = { ...state.cells[cellRef] };
          }
        }
      });
      
      state.cells = newCells;
      if (state.columns > 1) {
        state.columns -= 1;
      }
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

export const { 
  updateCell, 
  setVisibleRange, 
  setDimensions, 
  resetGrid, 
  loadSheetCells, 
  sortData,
  insertRowAfter,
  deleteRowAt,
  insertColumnAfter,
  deleteColumnAt
} = gridSlice.actions;
export default gridSlice.reducer;
