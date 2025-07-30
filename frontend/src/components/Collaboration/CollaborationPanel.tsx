import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import CollaborationStatus from "./CollaborationStatus";
import UserCursor from "./UserCursor";

const CollaborationPanel: React.FC = () => {
  const users = useSelector((state: RootState) => state.collaboration.users);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userIds = Object.keys(users);

  // Filter out current user from cursor display
  const otherUsers = userIds.filter(userId => {
    if (!currentUser) return true;
    return userId !== `auth_${currentUser.username}`;
  });

  return (
    <>
      <CollaborationStatus />
      {otherUsers.map((userId) => (
        <UserCursor key={userId} userId={userId} />
      ))}
    </>
  );
};

export default CollaborationPanel;
