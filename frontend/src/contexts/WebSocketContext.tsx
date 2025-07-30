import React, { createContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store';
import WebsocketService from '../services/websocketService';
import { updateCell } from '../store/gridSlice';
import { userPresenceUpdate, cursorUpdate, setConflict, setCellAction } from '../store/collaborationSlice';
import { setLoading, setNotification } from '../store/uiSlice';

interface WebSocketContextType {
  sendMessage: (message: object) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export { WebSocketContext, type WebSocketContextType };

interface WebSocketProviderProps {
  children: React.ReactNode;
  sheetId: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children, sheetId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const gridCells = useSelector((state: RootState) => state.grid.cells);
  const wsRef = useRef<WebsocketService | null>(null);
  const isConnectedRef = useRef(false);

  const sendMessage = (message: object) => {
    if (wsRef.current && isConnectedRef.current) {
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket not connected. Cannot send message:', message);
    }
  };

  useEffect(() => {
    if (!currentUser || !authToken) return;

    dispatch(setLoading(true));
    dispatch(setNotification({ type: "success", message: "Connecting to collaboration server..." }));

    const ws = new WebsocketService(sheetId);
    wsRef.current = ws;

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
      isConnectedRef.current = true;
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
            // If this is a conflict resolution, don't check for new conflicts
            if (msg.conflictResolved) {
              dispatch(setConflict({ cellRef: msg.cellRef, conflicted: false }));
            } else {
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

    return () => {
      // Send user leave message before closing
      if (isConnectedRef.current) {
        ws.send({
          type: "user_leave",
          userId: `auth_${currentUser.username}`,
          sheetId
        });
      }
      unsubscribeOnOpen();
      unsubscribe();
      ws.close();
      wsRef.current = null;
      isConnectedRef.current = false;
      dispatch(setLoading(false));
    };
  }, [sheetId, dispatch, currentUser, authToken, gridCells]);

  const contextValue: WebSocketContextType = {
    sendMessage,
    isConnected: isConnectedRef.current
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
