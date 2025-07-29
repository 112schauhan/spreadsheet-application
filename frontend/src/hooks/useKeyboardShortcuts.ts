import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { selectCell } from '../store/selectionSlice';

const useGridNavigation = () => {
  const dispatch = useDispatch();
  const selectedCell = useSelector((state: RootState) => state.selection.selectedCell);
  const { rows, columns } = useSelector((state: RootState) => state.grid);

  const getCoords = (ref: string) => {
    const m = /^([A-Z]+)([0-9]+)$/.exec(ref); if (!m) return null;
    return { col: m[1].charCodeAt(0) - 65, row: +m[2] - 1 };
  };
  const getCellRef = (col: number, row: number) =>
    String.fromCharCode(65 + col) + (row + 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      const c = getCoords(selectedCell); if (!c) return;
      let { row, col } = c;
      switch (e.key) {
        case 'ArrowUp': row = Math.max(row - 1, 0); break;
        case 'ArrowDown': row = Math.min(row + 1, rows - 1); break;
        case 'ArrowLeft': col = Math.max(col - 1, 0); break;
        case 'ArrowRight': col = Math.min(col + 1, columns - 1); break;
        case 'Tab':
          col = e.shiftKey ? Math.max(col - 1, 0) : Math.min(col + 1, columns - 1);
          e.preventDefault(); break;
        case 'Enter': row = Math.min(row + 1, rows - 1); e.preventDefault(); break;
        default: return;
      }
      dispatch(selectCell({ cellRef: getCellRef(col, row) }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedCell, rows, columns, dispatch]);
};

export default useGridNavigation;
