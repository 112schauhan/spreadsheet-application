import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { CELL_WIDTH, CELL_HEIGHT } from "../../config/constants";
import { parseCellRef, getColumnIndex } from "../../utils/selectionUtils";

const SelectionOverlay: React.FC = () => {
  const selection = useSelector((state: RootState) => state.selection);
  const grid = useSelector((state: RootState) => state.grid);

  if (!selection.selectedRanges.length && !selection.selectedRows.length && !selection.selectedColumns.length) {
    return null;
  }

  const overlays: React.ReactElement[] = [];

  // Render range selections
  selection.selectedRanges.forEach((range, index) => {
    const startCoords = parseCellRef(range.start);
    const endCoords = parseCellRef(range.end);
    
    if (!startCoords || !endCoords) return;

    const minRow = Math.min(startCoords.row, endCoords.row);
    const maxRow = Math.max(startCoords.row, endCoords.row);
    const minCol = Math.min(startCoords.col, endCoords.col);
    const maxCol = Math.max(startCoords.col, endCoords.col);

    const top = minRow * CELL_HEIGHT;
    const left = minCol * CELL_WIDTH;
    const width = (maxCol - minCol + 1) * CELL_WIDTH;
    const height = (maxRow - minRow + 1) * CELL_HEIGHT;

    overlays.push(
      <div
        key={`range-${index}`}
        className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 pointer-events-none"
        style={{
          top,
          left,
          width,
          height,
        }}
      />
    );
  });

  // Render row selections
  selection.selectedRows.forEach((rowNum, index) => {
    const top = (rowNum - 1) * CELL_HEIGHT;
    const left = 0;
    const width = grid.columns * CELL_WIDTH;
    const height = CELL_HEIGHT;

    overlays.push(
      <div
        key={`row-${index}`}
        className="absolute border-2 border-green-500 bg-green-100 bg-opacity-30 pointer-events-none"
        style={{
          top,
          left,
          width,
          height,
        }}
      />
    );
  });

  // Render column selections
  selection.selectedColumns.forEach((colLetter, index) => {
    const col = getColumnIndex(colLetter);
    const top = 0;
    const left = col * CELL_WIDTH;
    const width = CELL_WIDTH;
    const height = grid.rows * CELL_HEIGHT;

    overlays.push(
      <div
        key={`col-${index}`}
        className="absolute border-2 border-purple-500 bg-purple-100 bg-opacity-30 pointer-events-none"
        style={{
          top,
          left,
          width,
          height,
        }}
      />
    );
  });

  return <>{overlays}</>;
};

export default SelectionOverlay;
