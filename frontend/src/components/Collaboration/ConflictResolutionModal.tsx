import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState, useAppDispatch } from '../../store';
import { clearConflict } from '../../store/collaborationSlice';
import { updateCellWithHistory } from '../../store/gridSlice';
import { useWebSocket } from '../../hooks/useWebSocketContext';

interface ConflictResolutionModalProps {
  cellRef: string;
  isVisible: boolean;
  onClose: () => void;
}

const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  cellRef,
  isVisible,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const { sendMessage } = useWebSocket();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const cell = useSelector((state: RootState) => state.grid.cells[cellRef]);
  const { activeSheetId } = useSelector((state: RootState) => state.sheets);
  const lastModifiedBy = useSelector((state: RootState) => state.collaboration.actions[cellRef]);

  if (!isVisible) return null;

  const handleKeepLocal = () => {
    // Keep the current local value and mark conflict as resolved
    dispatch(clearConflict(cellRef));
    
    // Send the local value to other users
    if (cell) {
      sendMessage({
        type: "cell_update",
        cellRef,
        value: cell.value,
        formula: cell.formula,
        userId: currentUser ? `auth_${currentUser.username}` : 'anonymous',
        sheetId: activeSheetId,
        timestamp: Date.now(),
        conflictResolved: true
      });
    }
    
    onClose();
  };

  const handleKeepRemote = () => {
    // Accept the remote changes and mark conflict as resolved
    dispatch(clearConflict(cellRef));
    
    // The remote value is already applied, just resolve the conflict
    sendMessage({
      type: "conflict_resolved",
      cellRef,
      sheetId: activeSheetId,
      userId: currentUser ? `auth_${currentUser.username}` : 'anonymous'
    });
    
    onClose();
  };

  const handleMerge = (mergedValue: string) => {
    // Create a merged value and apply it
    dispatch(updateCellWithHistory({ 
      cellRef, 
      value: mergedValue,
      skipHistory: false 
    }));
    
    dispatch(clearConflict(cellRef));
    
    // Send the merged value to other users
    sendMessage({
      type: "cell_update",
      cellRef,
      value: mergedValue,
      userId: currentUser ? `auth_${currentUser.username}` : 'anonymous',
      sheetId: activeSheetId,
      timestamp: Date.now(),
      conflictResolved: true
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-red-600 mb-4">
          Conflict Detected in Cell {cellRef}
        </h3>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            Another user has modified this cell while you were editing it. 
            {lastModifiedBy && ` Last modified by: ${lastModifiedBy.replace('auth_', '')}`}
          </p>
          
          <div className="border rounded p-3">
            <h4 className="font-medium text-gray-800 mb-2">Your Version:</h4>
            <div className="bg-blue-50 p-2 rounded text-sm">
              {cell?.value || '(empty)'}
            </div>
          </div>
          
          <div className="border rounded p-3">
            <h4 className="font-medium text-gray-800 mb-2">Remote Version:</h4>
            <div className="bg-yellow-50 p-2 rounded text-sm">
              {cell?.value || '(empty)'} (from {lastModifiedBy?.replace('auth_', '') || 'another user'})
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleKeepLocal}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Keep My Version
            </button>
            
            <button
              onClick={handleKeepRemote}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Accept Their Version
            </button>
            
            <button
              onClick={() => {
                const mergedValue = prompt(
                  'Enter a merged value that combines both versions:',
                  cell?.value?.toString() || ''
                );
                if (mergedValue !== null) {
                  handleMerge(mergedValue);
                }
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Merge Values
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;
