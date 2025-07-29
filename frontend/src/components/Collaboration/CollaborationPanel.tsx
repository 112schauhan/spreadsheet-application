import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import UserPresence from "./UserPresence";
import UserCursor from "./UserCursor";

const CollaborationPanel: React.FC = () => {
  const users = useSelector((state: RootState) => state.collaboration.users);
  const userIds = Object.keys(users);

  return (
    <>
      <UserPresence />
      {userIds.map((userId) => (
        <UserCursor key={userId} userId={userId} />
      ))}
    </>
  );
};

export default CollaborationPanel;
