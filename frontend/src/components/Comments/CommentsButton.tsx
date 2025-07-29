import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import CellComments from "./CellComments";

const CommentsButton: React.FC = () => {
  const selectedCell = useSelector((state: RootState) => state.selection.selectedCell);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null); // null means not loaded

  const handleCommentsClose = (updatedCommentCount?: number) => {
    setShowComments(false);
    // Update comment count with the value from the comments component
    if (typeof updatedCommentCount === 'number') {
      setCommentCount(updatedCommentCount);
    }
  };

  // Reset comment count when cell changes
  useEffect(() => {
    setCommentCount(null);
  }, [selectedCell]);

  if (!selectedCell) {
    return (
      <button
        disabled
        className="flex items-center space-x-1 px-3 py-2 text-gray-400 bg-gray-100 rounded-md cursor-not-allowed"
        title="Select a cell to add comments"
      >
        <span>💬</span>
        <span className="text-sm">Comments</span>
      </button>
    );
  }

  const hasComments = commentCount !== null && commentCount > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowComments(!showComments)}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
          showComments
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : hasComments
            ? "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
        }`}
        title={`${hasComments ? `${commentCount} comment${commentCount! > 1 ? 's' : ''} on ` : 'Add comment to '}${selectedCell}`}
      >
        <span>💬</span>
        <span className="text-sm">Comments</span>
        {hasComments && (
          <span className="bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {commentCount! > 99 ? '99+' : commentCount}
          </span>
        )}
      </button>
      
      {showComments && (
        <CellComments
          cellRef={selectedCell}
          sheetId="default"
          isVisible={showComments}
          onClose={handleCommentsClose}
          onCommentCountChange={setCommentCount}
        />
      )}
    </div>
  );
};

export default CommentsButton;
