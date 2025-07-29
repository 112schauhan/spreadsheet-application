import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState, useAppDispatch } from '../store';
import { selectAll, clearSelection, selectCell } from '../store/selectionSlice';
import { parseCellRef, coordinatesToCellRef } from '../utils/selectionUtils';

const useSelectionKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  const selection = useSelector((state: RootState) => state.selection);
  const grid = useSelector((state: RootState) => state.grid);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not editing a cell
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl+A / Cmd+A - Select All
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        dispatch(selectAll({ rows: grid.rows, columns: grid.columns }));
        return;
      }

      // Escape - Clear Selection
      if (e.key === 'Escape') {
        e.preventDefault();
        dispatch(clearSelection());
        return;
      }

      // Arrow keys for navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        
        const currentCell = selection.lastSelectedCell || selection.selectedCell;
        if (!currentCell) return;

        const coords = parseCellRef(currentCell);
        if (!coords) return;

        let newRow = coords.row;
        let newCol = coords.col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, coords.row - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(grid.rows - 1, coords.row + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, coords.col - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(grid.columns - 1, coords.col + 1);
            break;
        }

        const newCellRef = coordinatesToCellRef({ row: newRow, col: newCol });
        const isRangeSelect = e.shiftKey;
        const isMultiSelect = e.ctrlKey || e.metaKey;

        dispatch(selectCell({ 
          cellRef: newCellRef, 
          isMultiSelect, 
          isRangeSelect 
        }));
        return;
      }

      // Enter - Move down
      if (e.key === 'Enter') {
        e.preventDefault();
        
        const currentCell = selection.lastSelectedCell || selection.selectedCell;
        if (!currentCell) return;

        const coords = parseCellRef(currentCell);
        if (!coords) return;

        const newRow = Math.min(grid.rows - 1, coords.row + 1);
        const newCellRef = coordinatesToCellRef({ row: newRow, col: coords.col });

        dispatch(selectCell({ cellRef: newCellRef }));
        return;
      }

      // Tab - Move right
      if (e.key === 'Tab') {
        e.preventDefault();
        
        const currentCell = selection.lastSelectedCell || selection.selectedCell;
        if (!currentCell) return;

        const coords = parseCellRef(currentCell);
        if (!coords) return;

        const newCol = e.shiftKey 
          ? Math.max(0, coords.col - 1)  // Shift+Tab = move left
          : Math.min(grid.columns - 1, coords.col + 1); // Tab = move right
        
        const newCellRef = coordinatesToCellRef({ row: coords.row, col: newCol });

        dispatch(selectCell({ cellRef: newCellRef }));
        return;
      }

      // Home - Go to beginning of row
      if (e.key === 'Home') {
        e.preventDefault();
        
        const currentCell = selection.lastSelectedCell || selection.selectedCell;
        if (!currentCell) return;

        const coords = parseCellRef(currentCell);
        if (!coords) return;

        if (e.ctrlKey || e.metaKey) {
          // Ctrl+Home - Go to A1
          dispatch(selectCell({ cellRef: 'A1' }));
        } else {
          // Home - Go to beginning of current row
          const newCellRef = coordinatesToCellRef({ row: coords.row, col: 0 });
          dispatch(selectCell({ cellRef: newCellRef }));
        }
        return;
      }

      // End - Go to end of row
      if (e.key === 'End') {
        e.preventDefault();
        
        const currentCell = selection.lastSelectedCell || selection.selectedCell;
        if (!currentCell) return;

        const coords = parseCellRef(currentCell);
        if (!coords) return;

        if (e.ctrlKey || e.metaKey) {
          // Ctrl+End - Go to last cell with data (simplified to last column)
          const lastCellRef = coordinatesToCellRef({ row: grid.rows - 1, col: grid.columns - 1 });
          dispatch(selectCell({ cellRef: lastCellRef }));
        } else {
          // End - Go to end of current row
          const newCellRef = coordinatesToCellRef({ row: coords.row, col: grid.columns - 1 });
          dispatch(selectCell({ cellRef: newCellRef }));
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, selection, grid.rows, grid.columns]);
};

export default useSelectionKeyboardShortcuts;
