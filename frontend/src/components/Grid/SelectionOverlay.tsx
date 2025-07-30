import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { CELL_WIDTH, CELL_HEIGHT } from "../../config/constants";
import { parseCellRef, getColumnIndex } from "../../utils/selectionUtils";

// Helper function to get coordinates from cell reference (same as SelectionManager)
const getCoords = (cellRef: string) => {
  const match = cellRef.match(/^([A-Z]+)([1-9][0-9]*)$/);
  if (!match) return null;
  
  // Convert column letters to index
  let colIndex = 0;
  const colStr = match[1];
  for (let i = 0; i < colStr.length; i++) {
    colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 65 + 1);
  }
  colIndex -= 1; // Convert to 0-based index
  
  return {
    col: colIndex,
    row: parseInt(match[2], 10) - 1, // Convert to 0-based
  };
};

const SelectionOverlay: React.FC = () => {
  const selection = useSelector((state: RootState) => state.selection);
  const grid = useSelector((state: RootState) => state.grid);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const collaborationUsers = useSelector((state: RootState) => state.collaboration.users);

  const overlays: React.ReactElement[] = [];

  // Get user color for single cell selection
  let userColor = "#3b82f6"; // Default blue
  if (currentUser?.color) {
    userColor = currentUser.color;
  } else if (currentUser?.username) {
    const collabUser = Object.values(collaborationUsers).find(u => u.username === currentUser.username);
    if (collabUser) {
      userColor = collabUser.color;
    }
  }

  // Render single cell selection (highest priority)
  if (selection.selectedCell) {
    const coords = getCoords(selection.selectedCell);
    if (coords) {
      overlays.push(
        <div
          key="single-cell"
          className="pointer-events-none absolute border-2 box-border transition-all duration-100"
          style={{
            top: coords.row * CELL_HEIGHT,
            left: coords.col * CELL_WIDTH,
            width: CELL_WIDTH,
            height: CELL_HEIGHT,
            borderColor: userColor,
            zIndex: 50, // Highest priority
          }}
        />
      );
    }
  }

  // Render range selections
  selection.selectedRanges.forEach((range, index) => {
    const startCoords = parseCellRef(range.start);
    const endCoords = parseCellRef(range.end);
    
    if (!startCoords || !endCoords) return;

    const minRow = Math.min(startCoords.row, endCoords.row);
    const maxRow = Math.max(startCoords.row, endCoords.row);
    const minCol = Math.min(startCoords.col, endCoords.col);
    const maxCol = Math.max(startCoords.col, endCoords.col);

    // Position relative to the grid content - coordinates are already 0-based from parseCellRef
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
          zIndex: 40,
        }}
      />
    );
  });

  // Render row selections
  selection.selectedRows.forEach((rowNum, index) => {
    // rowNum is 1-based, convert to 0-based for positioning
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
          zIndex: 35,
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
          zIndex: 35,
        }}
      />
    );
  });

  return <>{overlays}</>;
};

export default SelectionOverlay;