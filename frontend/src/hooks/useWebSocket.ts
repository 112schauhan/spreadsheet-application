/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import WebsocketService from "../services/websocketService";
import { updateCell } from "../store/gridSlice";
import { userPresenceUpdate, cursorUpdate, setConflict, setCellAction } from "../store/collaborationSlice";
import { setLoading, setNotification } from "../store/uiSlice";

export function useWebSocketConnection(sheetId: string) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const gridCells = useSelector((state: RootState) => state.grid.cells);

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
        case "cell_update": {
          // Handle real-time cell updates from other users
          const isOwnUpdate = currentUser && msg.userId === `auth_${currentUser.username}`;
          
          if (!isOwnUpdate) {
            // Check for potential conflicts
            const currentCellValue = gridCells[msg.cellRef];
            const hasLocalChanges = currentCellValue && 
              (currentCellValue.value !== msg.value || currentCellValue.formula !== msg.formula);
            
            if (hasLocalChanges) {
              // Conflict detected - show conflict indicator
              dispatch(setConflict({ cellRef: msg.cellRef, conflicted: true }));
              dispatch(setNotification({ 
                type: "error", 
                message: `Conflict detected in cell ${msg.cellRef}. Another user made changes.` 
              }));
            }
            
            // Update the cell with the remote changes
            dispatch(updateCell({
              cellRef: msg.cellRef,
              value: msg.value,
              formula: msg.formula
            }));
            
            // Track the action for visual feedback
            dispatch(setCellAction({ 
              cellRef: msg.cellRef, 
              userId: msg.userId, 
              action: 'edit' 
            }));
          }
          break;
        }
        case "user_presence":
          dispatch(userPresenceUpdate(msg.users));
          break;
        case "cursor_update":
          // Only show cursors from other users
          if (!currentUser || msg.userId !== `auth_${currentUser.username}`) {
            dispatch(cursorUpdate({ userId: msg.userId, position: msg.position }));
          }
          break;
        case "conflict_resolved":
          // Handle conflict resolution messages
          dispatch(setConflict({ cellRef: msg.cellRef, conflicted: false }));
          dispatch(setNotification({ 
            type: "success", 
            message: `Conflict in cell ${msg.cellRef} has been resolved.` 
          }));
          break;
        // Handle more events as needed
        default: 
          console.log("Unhandled WebSocket message type:", msg.type);
          break;
      }
    });

    // Store the WebSocket instance in a way that can be accessed by components
    // We'll return a send function that components can use
    const sendMessage = (message: object) => {
      ws.send(message);
    };

    // Attach the send function to the window for global access
    // This is a temporary solution - ideally we'd use a context or ref
    (window as any).wsSend = sendMessage;

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
      // Clean up the global reference
      delete (window as any).wsSend;
    };
  }, [sheetId, dispatch, currentUser, authToken, gridCells]);
}
