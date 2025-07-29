import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import GridHeader from "./GridHeader";
import RowHeader from "./RowHeader";
import VirtualizedGrid from "./VirtualizedGrid";
import SelectionManager from "./SelectionManager";
import UserCursor from "../Collaboration/UserCursor";
import ScrollIndicator from "./ScrollIndicator";
import useSelectionKeyboardShortcuts from "../../hooks/useSelectionKeyboardShortcuts";

const GridContainer: React.FC = () => {
  const users = useSelector((state: RootState) => state.collaboration.users);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
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
        <div className="w-12 h-8 border-r border-b border-gray-300 bg-gray-50 shrink-0" />
        <GridHeader />
      </div>
      <div className="flex flex-1 min-h-0">
        <RowHeader />
        <div className="relative flex-1 min-h-0">
          <VirtualizedGrid />
          <SelectionManager />
          {/* Render other users' cursors */}
          {otherUsers.map((userId) => (
            <UserCursor key={userId} userId={userId} />
          ))}
        </div>
      </div>
      {/* Scroll position indicator */}
      <ScrollIndicator />
    </div>
  );
};

export default GridContainer;