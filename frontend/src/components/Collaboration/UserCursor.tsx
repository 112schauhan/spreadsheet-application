// frontend/src/components/Collaboration/UserCursor.tsx
import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";

interface UserCursorProps {
  userId: string;
}

const CURSOR_SIZE = 12;

const UserCursor: React.FC<UserCursorProps> = ({ userId }) => {
  const cursors = useSelector((state: RootState) => state.collaboration.cursors);
  const users = useSelector((state: RootState) => state.collaboration.users);

  const cursor = cursors[userId];
  const user = users[userId];
  if (!cursor || !user) return null;

  return (
    <div
      className="absolute z-20 pointer-events-none rounded-full border-2 border-white shadow-md"
      style={{
        top: cursor.top,
        left: cursor.left,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        backgroundColor: user.color,
        transform: "translate(-50%, -50%)",
      }}
      aria-label={`${user.username}'s cursor`}
    >
      <span
        className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-opacity-90 text-xs font-semibold text-white whitespace-nowrap select-none shadow-lg"
        style={{ backgroundColor: user.color }}
      >
        {user.username}
      </span>
    </div>
  );
};

export default UserCursor;
