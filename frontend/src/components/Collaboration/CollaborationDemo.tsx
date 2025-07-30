import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

const CollaborationDemo: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const users = useSelector((state: RootState) => state.collaboration.users);
  const conflicts = useSelector((state: RootState) => state.collaboration.conflicts);
  const actions = useSelector((state: RootState) => state.collaboration.actions);

  const activeUsers = Object.values(users).filter(user => user.status === 'online');
  const conflictCount = Object.keys(conflicts).filter(cellRef => conflicts[cellRef]).length;
  const activeEdits = Object.keys(actions).length;

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>👥</span>
          <span>Collaboration Info</span>
          {activeUsers.length > 1 && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              {activeUsers.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Real-time Collaboration</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        {/* Active Users */}
        <div>
          <div className="font-medium text-gray-700 mb-1">Active Users ({activeUsers.length})</div>
          {activeUsers.length > 0 ? (
            <div className="space-y-1">
              {activeUsers.map(user => (
                <div key={user.userId} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: user.color }}
                  ></div>
                  <span className="text-gray-600">{user.username}</span>
                  <span className="text-xs text-gray-400">
                    {actions[Object.keys(actions).find(cellRef => actions[cellRef] === user.userId) || ''] ? 'editing' : 'viewing'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">No other users online</div>
          )}
        </div>
        
        {/* Live Activities */}
        <div>
          <div className="font-medium text-gray-700 mb-1">Live Activities</div>
          <div className="text-gray-600">
            {activeEdits > 0 ? (
              <div>📝 {activeEdits} cell{activeEdits !== 1 ? 's' : ''} being edited</div>
            ) : (
              <div>No active edits</div>
            )}
          </div>
        </div>
        
        {/* Conflicts */}
        {conflictCount > 0 && (
          <div>
            <div className="font-medium text-red-600 mb-1">⚠️ Conflicts ({conflictCount})</div>
            <div className="text-red-500 text-xs">
              {Object.keys(conflicts).filter(cellRef => conflicts[cellRef]).map(cellRef => (
                <div key={cellRef}>Cell {cellRef}</div>
              ))}
            </div>
          </div>
        )}
        
        {/* Testing Instructions */}
        <div className="border-t pt-3 mt-3">
          <div className="font-medium text-gray-700 mb-1">Testing Collaboration</div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>1. Open this app in multiple browser tabs</div>
            <div>2. Login with different accounts</div>
            <div>3. Edit the same cell simultaneously</div>
            <div>4. Watch live cursors and conflict resolution</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationDemo;
