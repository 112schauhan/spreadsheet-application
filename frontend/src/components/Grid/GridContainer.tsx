import React, { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import GridHeader from "./GridHeader";
import RowHeader from "./RowHeader";
import VirtualizedGrid from "./VirtualizedGrid";
import UserCursor from "../Collaboration/UserCursor";
import ConflictResolutionModal from "../Collaboration/ConflictResolutionModal";
import ScrollIndicator from "./ScrollIndicator";
import useSelectionKeyboardShortcuts from "../../hooks/useSelectionKeyboardShortcuts";

const GridContainer: React.FC = () => {
  const users = useSelector((state: RootState) => state.collaboration.users);
  const conflicts = useSelector((state: RootState) => state.collaboration.conflicts);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  // State for conflict resolution modal
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [conflictCellRef, setConflictCellRef] = useState<string>("");
  
  // Find the first conflicted cell to show in modal
  const conflictedCells = Object.keys(conflicts).filter(cellRef => conflicts[cellRef]);
  
  // Show conflict modal when there's a conflict
  React.useEffect(() => {
    if (conflictedCells.length > 0 && !conflictModalVisible) {
      setConflictCellRef(conflictedCells[0]);
      setConflictModalVisible(true);
    }
  }, [conflictedCells, conflictModalVisible]);
  
  // Enable keyboard shortcuts for selection
  useSelectionKeyboardShortcuts();
  
  // Filter out current user from cursor display
  const otherUsers = Object.keys(users).filter(userId => {
    if (!currentUser) return true;
    return userId !== `auth_${currentUser.username}`;
  });

  return (
    <div className="flex flex-col border border-gray-300 select-none flex-1 min-h-0">
      <div className="flex sticky top-0 z-10">
        <div className="w-12 h-8 border-r border-b border-gray-300 bg-gray-50 shrink-0 flex items-center justify-center">
          <span className="text-xs text-gray-500">📊</span>
        </div>
        <GridHeader />
      </div>
      <div className="flex flex-1 min-h-0 max-h-full">
        <RowHeader />
        <div className="relative flex-1 min-h-0 max-h-full overflow-hidden">
          <VirtualizedGrid />
          {/* Render other users' cursors */}
          {otherUsers.map((userId) => (
            <UserCursor key={userId} userId={userId} />
          ))}
        </div>
      </div>
      {/* Scroll position indicator */}
      <ScrollIndicator />
      
      {/* Grid info */}
      <div className="bg-gray-50 border-t border-gray-300 px-3 py-1 text-xs text-gray-600 flex justify-between">
        <span>Grid: 100 rows × 26 columns (A-Z)</span>
        <span>Use scrollbars to navigate</span>
      </div>
      
      {/* Conflict Resolution Modal */}
      <ConflictResolutionModal
        cellRef={conflictCellRef}
        isVisible={conflictModalVisible}
        onClose={() => setConflictModalVisible(false)}
      />
    </div>
  );
};

export default GridContainer;