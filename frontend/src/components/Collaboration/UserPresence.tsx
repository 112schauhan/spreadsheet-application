import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";

const UserPresence: React.FC = () => {
  const users = useSelector((state: RootState) => state.collaboration.users);
  const userArray = Object.values(users);

  return (
    <div className="flex items-center space-x-3 p-2 bg-gray-50 border-b border-gray-200 select-none">
      {userArray.length > 0 ? (
        userArray.map((user) => (
          <div
            key={user.userId}
            className="flex items-center space-x-2 cursor-default"
            title={`${user.username} (${user.status ?? "online"})`}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: user.color }}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-700 font-medium text-sm">{user.username}</span>
          </div>
        ))
      ) : (
        <div className="text-gray-400 text-sm">No users online</div>
      )}
    </div>
  );
};

export default UserPresence;
