import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store";
import { selectCell } from "../../store/selectionSlice";

const GridNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCell = useSelector((state: RootState) => state.selection.selectedCell);
  const columns = useSelector((state: RootState) => state.grid.columns);
  const rows = useSelector((state: RootState) => state.grid.rows);

  const getColLetter = (index: number) => {
    let result = '';
    let num = index;
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    }
    return result;
  };

  const parseColLetter = (colStr: string) => {
    let colIndex = 0;
    for (let i = 0; i < colStr.length; i++) {
      colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 65 + 1);
    }
    return colIndex - 1; // Convert to 0-based index
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const match = selectedCell.match(/^([A-Z]+)([1-9][0-9]*)$/);
      if (!match) return;
      let col = parseColLetter(match[1]);
      let row = parseInt(match[2], 10) - 1;

      switch (e.key) {
        case "ArrowUp":
          row = Math.max(row - 1, 0);
          e.preventDefault();
          break;
        case "ArrowDown":
          row = Math.min(row + 1, rows - 1);
          e.preventDefault();
          break;
        case "ArrowLeft":
          col = Math.max(col - 1, 0);
          e.preventDefault();
          break;
        case "ArrowRight":
          col = Math.min(col + 1, columns - 1);
          e.preventDefault();
          break;
        case "Tab":
          col = e.shiftKey ? Math.max(col - 1, 0) : Math.min(col + 1, columns - 1);
          e.preventDefault();
          break;
        case "Enter":
          row = Math.min(row + 1, rows - 1);
          e.preventDefault();
          break;
        default:
          return;
      }

      const newCellRef = `${getColLetter(col)}${row + 1}`;
      dispatch(selectCell({ cellRef: newCellRef }));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedCell, columns, rows, dispatch]);

  return null;
};

export default GridNavigation;
