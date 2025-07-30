import React from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

const CollaborationStatus: React.FC = () => {
  const users = useSelector((state: RootState) => state.collaboration.users);
  const cursors = useSelector((state: RootState) => state.collaboration.cursors);
  const actions = useSelector((state: RootState) => state.collaboration.actions);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const userArray = Object.values(users);
  const activeUsers = userArray.filter(user => user.status === 'online');

  // Get user activities
  const getUserActivity = (userId: string) => {
    const cursor = cursors[userId];
    const actionCells = Object.keys(actions).filter(cellRef => actions[cellRef] === userId);
    
    if (actionCells.length > 0) {
      return `Editing ${actionCells[0]}`;
    } else if (cursor) {
      return `Viewing ${cursor.cellRef}`;
    }
    return 'Active';
  };

  if (activeUsers.length <= 1) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Working solo</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 border-b border-gray-200 text-sm">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-700 font-medium">
          {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''} online
        </span>
      </div>
      
      <div className="flex -space-x-1 overflow-hidden">
        {activeUsers.slice(0, 5).map((user) => {
          // Don't show current user in the list
          if (currentUser && user.userId === `auth_${currentUser.username}`) {
            return null;
          }
          
          return (
            <div
              key={user.userId}
              className="relative group"
              title={`${user.username} - ${getUserActivity(user.userId)}`}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-semibold shadow-sm"
                style={{ backgroundColor: user.color }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {user.username}: {getUserActivity(user.userId)}
              </div>
            </div>
          );
        })}
        
        {activeUsers.length > 6 && (
          <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white font-semibold">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
      
      {/* Activity indicator */}
      <div className="text-gray-500 text-xs">
        {Object.keys(actions).length > 0 && (
          <span>📝 {Object.keys(actions).length} editing</span>
        )}
      </div>
    </div>
  );
};

export default CollaborationStatus;
