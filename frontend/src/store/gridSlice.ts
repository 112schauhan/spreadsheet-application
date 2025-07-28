import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CellData {
  value: string | number;
  formula?: string;
  version?: number;
}

interface GridState {
  rows: number;
  columns: number;
  cells: Record<string, CellData>;
  visibleRange: {
    rows: [number, number];
    cols: [number, number];
  };
}

const initialState: GridState = {
  rows: 100,
  columns: 26,
  cells: {},
  visibleRange: {
    rows: [1, 20],
    cols: [0, 10],
  },
};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    updateCell(state, action: PayloadAction<{ cellRef: string; value: string | number; formula?: string }>) {
      const { cellRef, value, formula } = action.payload;
      state.cells[cellRef] = { value, formula };
    },
    setVisibleRange(state, action: PayloadAction<{ rows: [number, number]; cols: [number, number] }>) {
      state.visibleRange = action.payload;
    },
  },
});

export const { updateCell, setVisibleRange } = gridSlice.actions;
export default gridSlice.reducer;