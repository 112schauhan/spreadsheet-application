import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { updateCell } from '../store/gridSlice';
import { cellsToTSV, tsvToCells } from '../utils/clipboardUtils';
import { getCellsInRange } from '../utils/selectionUtils';

const useCopyPaste = () => {
  const dispatch = useDispatch();
  const selection = useSelector((state: RootState) => state.selection);
  const cells = useSelector((state: RootState) => state.grid.cells);

  useEffect(() => {
    const handleCopy = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        
        let cellRefs: string[] = [];
        
        // Handle different selection types
        if (selection.selectedRange) {
          cellRefs = getCellsInRange(selection.selectedRange);
        } else if (selection.selectedCells.length > 0) {
          cellRefs = selection.selectedCells;
        } else if (selection.selectedCell) {
          cellRefs = [selection.selectedCell];
        }
        
        if (cellRefs.length > 0) {
          const tsv = cellsToTSV(cellRefs, cells);
          navigator.clipboard.writeText(tsv).catch(console.error);
        }
      }
    };

    const handlePaste = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        
        if (selection.selectedCell) {
          navigator.clipboard.readText().then(text => {
            if (text) {
              const updates = tsvToCells(text, selection.selectedCell!);
              Object.entries(updates).forEach(([cellRef, cellObj]) => {
                dispatch(updateCell({ cellRef, value: cellObj.value }));
              });
            }
          }).catch(console.error);
        }
      }
    };

    // Only handle shortcuts when not editing a cell
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      handleCopy(e);
      handlePaste(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, selection, cells]);
};

export default useCopyPaste;