import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import WebsocketService from '../services/websocketService';
import { updateCell } from '../store/gridSlice';
import { userPresenceUpdate, cursorUpdate } from '../store/collaborationSlice';

const useRealTimeUpdates = (sheetId: string) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const ws = new WebsocketService(sheetId);
    const unsub = ws.onMessage((data) => {
      if (data.type === 'cell_update') dispatch(updateCell(data));
      if (data.type === 'user_presence') dispatch(userPresenceUpdate(data.users));
      if (data.type === 'cursor_update') dispatch(cursorUpdate({ userId: data.userId, position: data.position }));
    });
    return () => { unsub(); ws.close(); };
  }, [dispatch, sheetId]);
};

export default useRealTimeUpdates;