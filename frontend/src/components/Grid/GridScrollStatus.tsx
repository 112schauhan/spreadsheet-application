import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { CELL_WIDTH, CELL_HEIGHT } from "../../config/constants";

const GridScrollStatus: React.FC = () => {
  const grid = useSelector((state: RootState) => state.grid);
  const selectedCell = useSelector((state: RootState) => state.selection.selectedCell);
  const [scrollInfo, setScrollInfo] = useState({
    viewportStart: { row: 1, col: 'A' },
    viewportEnd: { row: 20, col: 'J' },
    totalCells: { rows: 1000, cols: 26 }
  });

  const getColLetter = (colIndex: number) => {
    let result = '';
    let num = colIndex;
    while (num >= 0) {
      result = String.fromCharCode(65 + (num % 26)) + result;
      num = Math.floor(num / 26) - 1;
    }
    return result;
  };

  useEffect(() => {
    const gridContainer = document.querySelector('.spreadsheet-scroll');
    if (!gridContainer) return;

    const updateScrollInfo = () => {
      const element = gridContainer as HTMLElement;
      const scrollTop = element.scrollTop;
      const scrollLeft = element.scrollLeft;
      const clientHeight = element.clientHeight;
      const clientWidth = element.clientWidth;

      const startRow = Math.floor(scrollTop / CELL_HEIGHT) + 1;
      const endRow = Math.min(startRow + Math.floor(clientHeight / CELL_HEIGHT), grid.rows);
      const startCol = Math.floor(scrollLeft / CELL_WIDTH);
      const endCol = Math.min(startCol + Math.floor(clientWidth / CELL_WIDTH), grid.columns - 1);

      setScrollInfo({
        viewportStart: { row: startRow, col: getColLetter(startCol) },
        viewportEnd: { row: endRow, col: getColLetter(endCol) },
        totalCells: { rows: grid.rows, cols: grid.columns }
      });
    };

    updateScrollInfo();
    gridContainer.addEventListener('scroll', updateScrollInfo);
    return () => gridContainer.removeEventListener('scroll', updateScrollInfo);
  }, [grid.rows, grid.columns]);

  return (
    <div className="hidden lg:flex items-center space-x-4 text-xs text-gray-600 bg-gray-50 px-3 py-1 border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <span className="font-medium">View:</span>
        <span className="font-mono">
          {scrollInfo.viewportStart.col}{scrollInfo.viewportStart.row}:
          {scrollInfo.viewportEnd.col}{scrollInfo.viewportEnd.row}
        </span>
      </div>
      
      {selectedCell && (
        <div className="flex items-center space-x-2">
          <span className="font-medium">Selected:</span>
          <span className="font-mono font-medium text-blue-600">{selectedCell}</span>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <span className="font-medium">Grid:</span>
        <span className="font-mono">
          {scrollInfo.totalCells.cols} × {scrollInfo.totalCells.rows}
        </span>
      </div>
    </div>
  );
};

export default GridScrollStatus;
