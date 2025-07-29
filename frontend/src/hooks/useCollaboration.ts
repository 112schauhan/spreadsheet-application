import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { userPresenceUpdate, cursorUpdate } from "../store/collaborationSlice"
import WebsocketService from "../services/websocketService"

const useCollaboration = (sheetId: string) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const ws = new WebsocketService(sheetId)
    ws.send({
      type: "join",
      username: "User_" + Math.floor(Math.random() * 9999),
    })
    const unsub = ws.onMessage((data) => {
      if (data.type === "user_presence")
        dispatch(userPresenceUpdate(data.users))
      if (data.type === "cursor_update")
        dispatch(cursorUpdate({ userId: data.userId, position: data.position }))
    })
    return () => {
      unsub()
      ws.close()
    }
  }, [dispatch, sheetId])
}

export default useCollaboration
