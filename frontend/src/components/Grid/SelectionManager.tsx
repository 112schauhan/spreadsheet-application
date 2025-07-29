import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { CELL_WIDTH, CELL_HEIGHT } from "../../config/constants";

const getCoords = (cellRef: string) => {
  // Updated to support multi-letter columns (A-Z, AA-CV)
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
    row: parseInt(match[2], 10) - 1,
  };
};

const SelectionManager: React.FC = () => {
  const selectedCell = useSelector((state: RootState) => state.selection.selectedCell);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const collaborationUsers = useSelector((state: RootState) => state.collaboration.users);
  
  if (!selectedCell) return null;

  const coords = getCoords(selectedCell);
  if (!coords) return null;

  // Get user color - prefer auth user color, then collaboration state, fallback to blue
  let userColor = "#3b82f6"; // Default blue
  if (currentUser?.color) {
    userColor = currentUser.color;
  } else if (currentUser?.username) {
    const collabUser = Object.values(collaborationUsers).find(u => u.username === currentUser.username);
    if (collabUser) {
      userColor = collabUser.color;
    }
  }

  return (
    <div
      className="pointer-events-none absolute border-2 box-border transition-all duration-100"
      style={{
        top: coords.row * CELL_HEIGHT,
        left: coords.col * CELL_WIDTH,
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        borderColor: userColor,
      }}
    />
  );
};

export default SelectionManager;
