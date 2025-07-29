import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CellRange {
  start: string;
  end: string;
}

export interface SelectionState {
  selectedCell: string | null;
  selectedCells: string[]; // Multiple individual cells
  selectedRange: CellRange | null;
  selectedRanges: CellRange[]; // Multiple ranges
  selectedRows: number[]; // Selected row indices
  selectedColumns: string[]; // Selected column letters (A, B, C, etc.)
  isMultiSelect: boolean; // Whether Ctrl/Cmd is held
  lastSelectedCell: string | null; // For range selection with Shift
}

const initialState: SelectionState = {
  selectedCell: null,
  selectedCells: [],
  selectedRange: null,
  selectedRanges: [],
  selectedRows: [],
  selectedColumns: [],
  isMultiSelect: false,
  lastSelectedCell: null,
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    selectCell(state, action: PayloadAction<{ 
      cellRef: string; 
      isMultiSelect?: boolean; 
      isRangeSelect?: boolean;
    }>) {
      const { cellRef, isMultiSelect = false, isRangeSelect = false } = action.payload;
      
      if (isRangeSelect && state.lastSelectedCell) {
        // Range selection with Shift key
        state.selectedRange = { start: state.lastSelectedCell, end: cellRef };
        state.selectedCell = cellRef;
        state.selectedCells = [];
        state.selectedRows = [];
        state.selectedColumns = [];
      } else if (isMultiSelect) {
        // Multi-selection with Ctrl/Cmd key
        if (state.selectedCells.includes(cellRef)) {
          // Remove if already selected
          state.selectedCells = state.selectedCells.filter(cell => cell !== cellRef);
        } else {
          // Add to selection
          state.selectedCells.push(cellRef);
        }
        state.selectedCell = cellRef;
        state.selectedRange = null;
        state.selectedRows = [];
        state.selectedColumns = [];
      } else {
        // Single selection
        state.selectedCell = cellRef;
        state.selectedCells = [];
        state.selectedRange = null;
        state.selectedRanges = [];
        state.selectedRows = [];
        state.selectedColumns = [];
      }
      
      state.lastSelectedCell = cellRef;
      state.isMultiSelect = isMultiSelect;
    },

    selectRange(state, action: PayloadAction<{ 
      range: CellRange; 
      isMultiSelect?: boolean;
    }>) {
      const { range, isMultiSelect = false } = action.payload;
      
      if (isMultiSelect) {
        // Add to existing ranges
        state.selectedRanges.push(range);
      } else {
        // Replace current selection
        state.selectedRange = range;
        state.selectedRanges = [];
        state.selectedCells = [];
      }
      
      state.selectedCell = null;
      state.selectedRows = [];
      state.selectedColumns = [];
      state.isMultiSelect = isMultiSelect;
    },

    selectRow(state, action: PayloadAction<{ 
      rowIndex: number; 
      isMultiSelect?: boolean;
    }>) {
      const { rowIndex, isMultiSelect = false } = action.payload;
      
      if (isMultiSelect) {
        if (state.selectedRows.includes(rowIndex)) {
          // Remove if already selected
          state.selectedRows = state.selectedRows.filter(row => row !== rowIndex);
        } else {
          // Add to selection
          state.selectedRows.push(rowIndex);
        }
      } else {
        // Single row selection
        state.selectedRows = [rowIndex];
      }
      
      // Clear other selections
      state.selectedCell = null;
      state.selectedCells = [];
      state.selectedRange = null;
      state.selectedRanges = [];
      state.selectedColumns = [];
      state.isMultiSelect = isMultiSelect;
    },

    selectColumn(state, action: PayloadAction<{ 
      columnLetter: string; 
      isMultiSelect?: boolean;
    }>) {
      const { columnLetter, isMultiSelect = false } = action.payload;
      
      if (isMultiSelect) {
        if (state.selectedColumns.includes(columnLetter)) {
          // Remove if already selected
          state.selectedColumns = state.selectedColumns.filter(col => col !== columnLetter);
        } else {
          // Add to selection
          state.selectedColumns.push(columnLetter);
        }
      } else {
        // Single column selection
        state.selectedColumns = [columnLetter];
      }
      
      // Clear other selections
      state.selectedCell = null;
      state.selectedCells = [];
      state.selectedRange = null;
      state.selectedRanges = [];
      state.selectedRows = [];
      state.isMultiSelect = isMultiSelect;
    },

    selectAll(state, action: PayloadAction<{ rows: number; columns: number }>) {
      const { rows, columns } = action.payload;
      // Select entire grid
      state.selectedCell = null;
      state.selectedCells = [];
      state.selectedRange = null;
      state.selectedRanges = [];
      state.selectedRows = [];
      state.selectedColumns = [];
      
      // Convert column index to column letter
      const getColumnLetter = (colIndex: number) => {
        let result = '';
        let num = colIndex - 1; // Convert to 0-based
        while (num >= 0) {
          result = String.fromCharCode(65 + (num % 26)) + result;
          num = Math.floor(num / 26) - 1;
        }
        return result;
      };
      
      // Set a range for the entire grid
      const endCol = getColumnLetter(columns);
      state.selectedRange = { start: 'A1', end: `${endCol}${rows}` };
      state.isMultiSelect = false;
    },

    clearSelection(state) {
      state.selectedCell = null;
      state.selectedCells = [];
      state.selectedRange = null;
      state.selectedRanges = [];
      state.selectedRows = [];
      state.selectedColumns = [];
      state.isMultiSelect = false;
      state.lastSelectedCell = null;
    },

    setMultiSelectMode(state, action: PayloadAction<boolean>) {
      state.isMultiSelect = action.payload;
    },
  },
});

export const { 
  selectCell, 
  selectRange, 
  selectRow, 
  selectColumn, 
  selectAll, 
  clearSelection,
  setMultiSelectMode
} = selectionSlice.actions;

export default selectionSlice.reducer;
