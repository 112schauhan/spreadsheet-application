import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import { selectCell } from '../store/selectionSlice';
import { CELL_HEIGHT, CELL_WIDTH } from '../config/constants';

const useGridNavigation = () => {
  const dispatch = useDispatch();
  const selectedCell = useSelector((state: RootState) => state.selection.selectedCell);
  const { rows, columns } = useSelector((state: RootState) => state.grid);

  const getCoords = (ref: string) => {
    const m = /^([A-Z]+)([0-9]+)$/.exec(ref); if (!m) return null;
    // Handle multi-letter columns properly
    let col = 0;
    for (let i = 0; i < m[1].length; i++) {
      col = col * 26 + (m[1].charCodeAt(i) - 65 + 1);
    }
    return { col: col - 1, row: +m[2] - 1 }; // Convert to 0-based
  };

  const getCellRef = (col: number, row: number) => {
    // Handle multi-letter columns properly
    let colStr = '';
    let num = col;
    while (num >= 0) {
      colStr = String.fromCharCode(65 + (num % 26)) + colStr;
      num = Math.floor(num / 26) - 1;
    }
    return colStr + (row + 1);
  };

  const scrollToCell = useCallback((cellRef: string) => {
    const coords = getCoords(cellRef);
    if (!coords) return;

    const gridContainer = document.querySelector('.spreadsheet-scroll') as HTMLElement;
    if (!gridContainer) return;

    const cellTop = coords.row * CELL_HEIGHT;
    const cellLeft = coords.col * CELL_WIDTH;
    const cellBottom = cellTop + CELL_HEIGHT;
    const cellRight = cellLeft + CELL_WIDTH;

    const { scrollTop, scrollLeft, clientHeight, clientWidth } = gridContainer;
    const visibleTop = scrollTop;
    const visibleLeft = scrollLeft;
    const visibleBottom = scrollTop + clientHeight;
    const visibleRight = scrollLeft + clientWidth;

    let newScrollTop = scrollTop;
    let newScrollLeft = scrollLeft;

    if (cellTop < visibleTop) {
      newScrollTop = cellTop;
    } else if (cellBottom > visibleBottom) {
      newScrollTop = cellBottom - clientHeight;
    }

    if (cellLeft < visibleLeft) {
      newScrollLeft = cellLeft;
    } else if (cellRight > visibleRight) {
      newScrollLeft = cellRight - clientWidth;
    }

    if (newScrollTop !== scrollTop || newScrollLeft !== scrollLeft) {
      gridContainer.scrollTo({
        top: Math.max(0, newScrollTop),
        left: Math.max(0, newScrollLeft),
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedCell) return;
      const c = getCoords(selectedCell); if (!c) return;
      let { row, col } = c;
      
      const gridContainer = document.querySelector('.spreadsheet-scroll') as HTMLElement;
      const visibleRows = gridContainer ? Math.floor(gridContainer.clientHeight / CELL_HEIGHT) : 10;

      switch (e.key) {
        case 'ArrowUp': row = Math.max(row - 1, 0); break;
        case 'ArrowDown': row = Math.min(row + 1, rows - 1); break;
        case 'ArrowLeft': col = Math.max(col - 1, 0); break;
        case 'ArrowRight': col = Math.min(col + 1, columns - 1); break;
        case 'Tab':
          col = e.shiftKey ? Math.max(col - 1, 0) : Math.min(col + 1, columns - 1);
          e.preventDefault(); break;
        case 'Enter': row = Math.min(row + 1, rows - 1); e.preventDefault(); break;
        case 'PageUp': 
          row = Math.max(row - visibleRows, 0); 
          e.preventDefault(); break;
        case 'PageDown': 
          row = Math.min(row + visibleRows, rows - 1); 
          e.preventDefault(); break;
        case 'Home':
          if (e.ctrlKey) {
            row = 0; col = 0; // Ctrl+Home - go to A1
          } else {
            col = 0; // Home - go to column A
          }
          e.preventDefault(); break;
        case 'End':
          if (e.ctrlKey) {
            row = rows - 1; col = columns - 1; // Ctrl+End - go to last cell
          } else {
            col = columns - 1; // End - go to last column
          }
          e.preventDefault(); break;
        default: return;
      }
      
      const newCellRef = getCellRef(col, row);
      dispatch(selectCell({ cellRef: newCellRef }));
      scrollToCell(newCellRef);
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedCell, rows, columns, dispatch, scrollToCell]);
};

export default useGridNavigation;