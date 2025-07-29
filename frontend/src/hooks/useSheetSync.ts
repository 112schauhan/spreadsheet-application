import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { type RootState } from '../store';
import { loadSheetCells, updateCell as updateGridCell } from '../store/gridSlice';
import { updateSheetCell } from '../store/sheetsSlice';

/**
 * Custom hook to sync active sheet data with grid state
 */
export const useSheetSync = () => {
  const dispatch = useDispatch();
  const { sheets, activeSheetId } = useSelector((state: RootState) => state.sheets);
  const gridCells = useSelector((state: RootState) => state.grid.cells);

  // Get current active sheet
  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId);

  // Load active sheet cells into grid when sheet changes
  useEffect(() => {
    if (activeSheet) {
      dispatch(loadSheetCells(activeSheet.cells));
    }
  }, [activeSheetId, activeSheet, dispatch]);

  // Custom updateCell function that updates both grid and sheet
  const updateCell = (cellRef: string, value: string | number | null, formula?: string) => {
    // Update the grid state for immediate UI response
    dispatch(updateGridCell({ cellRef, value: value || '', formula }));
    
    // Update the sheet data for persistence
    dispatch(updateSheetCell({ 
      sheetId: activeSheetId, 
      cellRef, 
      value, 
      formula 
    }));
  };

  return {
    activeSheet,
    activeSheetId,
    updateCell,
    gridCells
  };
};

export default useSheetSync;
