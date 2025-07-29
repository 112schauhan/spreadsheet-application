import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { demoSheets } from "../data/demoData";
import { type CellData } from "../types/grid.types";

export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, CellData>;
  isActive: boolean;
}

interface SheetsState {
  sheets: Sheet[];
  activeSheetId: string;
}

const initialState: SheetsState = {
  sheets: [
    {
      ...demoSheets[0],
      isActive: true
    },
    {
      ...demoSheets[1],
      isActive: false
    }
  ],
  activeSheetId: "sheet1"
};

const sheetsSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {
    addSheet: (state, action: PayloadAction<{ name?: string }>) => {
      const newSheetId = `sheet${state.sheets.length + 1}`;
      const newSheet: Sheet = {
        id: newSheetId,
        name: action.payload.name || `Sheet ${state.sheets.length + 1}`,
        cells: {},
        isActive: false
      };
      
      // Set all existing sheets to inactive
      state.sheets.forEach(sheet => {
        sheet.isActive = false;
      });
      
      // Add new sheet and make it active
      newSheet.isActive = true;
      state.sheets.push(newSheet);
      state.activeSheetId = newSheetId;
    },
    
    deleteSheet: (state, action: PayloadAction<string>) => {
      const sheetId = action.payload;
      
      // Don't allow deleting if it's the only sheet
      if (state.sheets.length <= 1) return;
      
      const sheetIndex = state.sheets.findIndex(sheet => sheet.id === sheetId);
      if (sheetIndex === -1) return;
      
      // If deleting active sheet, activate another one
      if (sheetId === state.activeSheetId) {
        const newActiveIndex = sheetIndex === 0 ? 1 : sheetIndex - 1;
        state.activeSheetId = state.sheets[newActiveIndex].id;
        state.sheets[newActiveIndex].isActive = true;
      }
      
      // Remove the sheet
      state.sheets.splice(sheetIndex, 1);
    },
    
    switchSheet: (state, action: PayloadAction<string>) => {
      const newActiveSheetId = action.payload;
      
      // Set all sheets to inactive
      state.sheets.forEach(sheet => {
        sheet.isActive = false;
      });
      
      // Activate the selected sheet
      const targetSheet = state.sheets.find(sheet => sheet.id === newActiveSheetId);
      if (targetSheet) {
        targetSheet.isActive = true;
        state.activeSheetId = newActiveSheetId;
      }
    },
    
    updateSheetCell: (state, action: PayloadAction<{
      sheetId: string;
      cellRef: string;
      value: string | number | null;
      formula?: string;
    }>) => {
      const { sheetId, cellRef, value, formula } = action.payload;
      const sheet = state.sheets.find(s => s.id === sheetId);
      
      if (sheet) {
        sheet.cells[cellRef] = { value, ...(formula && { formula }) };
      }
    },
    
    renameSheet: (state, action: PayloadAction<{ sheetId: string; newName: string }>) => {
      const { sheetId, newName } = action.payload;
      const sheet = state.sheets.find(s => s.id === sheetId);
      
      if (sheet) {
        sheet.name = newName;
      }
    }
  }
});

export const {
  addSheet,
  deleteSheet,
  switchSheet,
  updateSheetCell,
  renameSheet
} = sheetsSlice.actions;

export default sheetsSlice.reducer;
