import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import { setCommentCount } from "../../store/commentSlice";
import { fetchCellComments, addCellComment } from "../../services/commentsService";
import { type Comment } from "../../types/api.types";
import LoadingSpinner from "../UI/LoadingSpinner";

interface CellCommentsProps {
  cellRef: string;
  sheetId: string;
  isVisible: boolean;
  onClose: (commentCount?: number) => void;
  onCommentCountChange?: (count: number) => void;
}

const CellComments: React.FC<CellCommentsProps> = ({ 
  cellRef, 
  sheetId, 
  isVisible, 
  onClose,
  onCommentCountChange
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  // Get current comment count from Redux store to determine if we should fetch
  const currentCommentCount = useSelector((state: RootState) => 
    state.comments.commentCounts[cellRef] || 0
  );
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addingComment, setAddingComment] = useState(false);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const closeComments = () => {
    onClose(comments.length);
  };

  const updateCommentCount = React.useCallback((count: number) => {
    // Update both local callback and Redux store
    onCommentCountChange?.(count);
    dispatch(setCommentCount({ cellRef, count }));
  }, [cellRef, dispatch, onCommentCountChange]);

  const loadComments = React.useCallback(async () => {
    // Only fetch comments if:
    // 1. We know there are comments for this cell (from Redux store), OR
    // 2. We haven't loaded comments for this cell yet and user explicitly opened comments
    const shouldFetch = currentCommentCount > 0 || !hasLoadedComments;
    
    if (!shouldFetch) {
      // No comments and we've already checked - set empty state
      setComments([]);
      updateCommentCount(0);
      setHasLoadedComments(true);
      return;
    }

    try {
      setLocalLoading(true);
      setError(null);
      const cellComments = await fetchCellComments(sheetId, cellRef);
      setComments(cellComments);
      setHasLoadedComments(true);
      // Update comment count in store and parent
      updateCommentCount(cellComments.length);
    } catch (error) {
      console.error("Failed to load comments:", error);
      setError(error instanceof Error ? error.message : "Failed to load comments");
      setHasLoadedComments(true);
      updateCommentCount(0);
    } finally {
      setLocalLoading(false);
    }
  }, [sheetId, cellRef, updateCommentCount, currentCommentCount, hasLoadedComments]);

  useEffect(() => {
    if (isVisible && cellRef) {
      loadComments();
    } else if (!isVisible) {
      // Reset state when dialog closes
      setError(null);
      setNewComment("");
      setHasLoadedComments(false);
      setSuccessMessage(null);
    }
  }, [isVisible, cellRef, loadComments]);

  // Reset when cellRef changes
  useEffect(() => {
    setHasLoadedComments(false);
    setComments([]);
    setError(null);
    setNewComment("");
    setSuccessMessage(null);
  }, [cellRef]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    try {
      setAddingComment(true);
      setError(null);
      const comment = await addCellComment(
        sheetId,
        cellRef,
        `auth_${currentUser.username}`,
        newComment.trim()
      );
      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      setNewComment("");
      // Update comment count in store and parent
      updateCommentCount(updatedComments.length);
      
      // Show success message briefly
      setSuccessMessage("Comment added successfully!");
      
      // Close the dialog after successfully adding the comment
      setTimeout(() => {
        setSuccessMessage(null);
        closeComments();
      }, 1000); // Show success message for 1 second before closing
      
    } catch (error) {
      console.error("Failed to add comment:", error);
      setError(error instanceof Error ? error.message : "Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    } else if (e.key === "Escape") {
      closeComments();
    }
  };

  const formatUsername = (userId: string) => {
    // Remove 'auth_' prefix if present
    return userId.startsWith('auth_') ? userId.substring(5) : userId;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Comments for {cellRef}</h3>
          <button
            onClick={closeComments}
            className="text-gray-500 hover:text-gray-700 w-6 h-6 flex items-center justify-center rounded"
            title="Close comments"
          >
            ✕
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border-b border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-green-700 text-sm">✓ {successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <div className="flex justify-between items-center">
            <span className="text-red-700 text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
          <button
            onClick={loadComments}
            className="mt-2 text-red-600 hover:text-red-800 text-xs underline"
          >
            Try again
          </button>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="small" message="Loading comments..." overlay={false} />
          </div>
        ) : comments.length === 0 && currentCommentCount === 0 && hasLoadedComments ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-lg mb-2">💬</div>
            <div>No comments yet</div>
            <div className="text-xs text-gray-400 mt-1">Be the first to add a comment!</div>
          </div>
        ) : comments.length === 0 && currentCommentCount > 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-lg mb-2">⏳</div>
            <div>Comments exist but not loaded</div>
            <div className="text-xs text-gray-400 mt-1">Comments will load when you open this dialog</div>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.commentId} className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-blue-600">
                    {formatUsername(comment.userId)}
                  </span>
                  <span className="text-xs text-gray-500" title={new Date(comment.timestamp * 1000).toLocaleString()}>
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        {!currentUser ? (
          <div className="text-center text-gray-500 text-sm">
            Please log in to add comments
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Add a comment... (Enter to submit, Shift+Enter for new line)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              disabled={addingComment}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {newComment.length > 0 && `${newComment.length} characters`}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={closeComments}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                  disabled={addingComment}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || addingComment}
                  className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center space-x-1"
                >
                  {addingComment && <LoadingSpinner size="small" message="" overlay={false} />}
                  <span>{addingComment ? 'Adding...' : 'Add Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CellComments;
