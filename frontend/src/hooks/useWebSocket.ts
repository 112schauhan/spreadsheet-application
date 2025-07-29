import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import WebsocketService from "../services/websocketService";
import { updateCell } from "../store/gridSlice";
import { userPresenceUpdate, cursorUpdate } from "../store/collaborationSlice";
import { setLoading, setNotification } from "../store/uiSlice";

export function useWebSocketConnection(sheetId: string) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!currentUser || !authToken) return;

    dispatch(setLoading(true));
    dispatch(setNotification({ type: "success", message: "Connecting to collaboration server..." }));

    const ws = new WebsocketService(sheetId);

    // Send user join message when connection is established
    const sendUserJoin = () => {
      ws.send({
        type: "user_join",
        user: {
          userId: `auth_${currentUser.username}`,
          username: currentUser.username,
          color: currentUser.color || "#3b82f6",
          status: "online",
          lastActive: Date.now()
        },
        sheetId
      });
      dispatch(setLoading(false));
      dispatch(setNotification({ type: "success", message: "Connected to collaboration server!" }));
    };

    // Send user join message when WebSocket connection is open
    const unsubscribeOnOpen = ws.onOpen(sendUserJoin);

    const unsubscribe = ws.onMessage((msg) => {
      switch (msg.type) {
        case "cell_update":
          dispatch(updateCell(msg));
          break;
        case "user_presence":
          dispatch(userPresenceUpdate(msg.users));
          break;
        case "cursor_update":
          dispatch(cursorUpdate({ userId: msg.userId, position: msg.position }));
          break;
        // Handle more events as needed
        default: break;
      }
    });

    return () => {
      // Send user leave message before closing
      ws.send({
        type: "user_leave",
        userId: `auth_${currentUser.username}`,
        sheetId
      });
      unsubscribeOnOpen();
      unsubscribe();
      ws.close();
      dispatch(setLoading(false));
    };
  }, [sheetId, dispatch, currentUser, authToken]);
}
