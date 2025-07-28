from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
from collaboration import CollaborationService
from user import UserService
from spreadsheet import SpreadsheetService


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_service = UserService()
        self.spreadsheet_service = SpreadsheetService()
        self.collaboration_service = CollaborationService(
            self.spreadsheet_service)
        self.usernames: Dict[str, Dict[WebSocket, str]] = {}

    async def connect(self, websocket: WebSocket, sheet_id: str):
        await websocket.accept()
        if sheet_id not in self.active_connections:
            self.active_connections[sheet_id] = []
            self.usernames[sheet_id] = {}
        self.active_connections[sheet_id].append(websocket)

    def disconnect(self, websocket: WebSocket, sheet_id: str):
        self.active_connections[sheet_id].remove(websocket)
        self.usernames[sheet_id].pop(websocket, None)

    async def broadcast(self, sheet_id: str, message: dict):
        if sheet_id in self.active_connections:
            data = json.dumps(message)
            for connection in self.active_connections[sheet_id]:
                await connection.send_text(data)

    async def receive(self, websocket: WebSocket, sheet_id: str):
        try:
            while True:
                data = await websocket.receive_text()
                message = json.loads(data)
                await self.handle_message(sheet_id, websocket, message)
        except WebSocketDisconnect:
            self.disconnect(websocket, sheet_id)
            # Optionally broadcast user left

    async def handle_message(self, sheet_id: str, websocket: WebSocket, message: dict):
        # Example message types: 'join', 'cell_update', 'cursor_update', 'user_presence', 'comment_add', 'history_request'
        msg_type = message.get("type")
        if msg_type == "join":
            username = message.get("username", "Anonymous")
            user = self.user_service.add_user(sheet_id, username)
            self.usernames[sheet_id][websocket] = user.user_id
            await self.broadcast(sheet_id, {"type": "user_presence", "users": [u.username for u in self.user_service.get_users(sheet_id)]})
        elif msg_type == "cell_update":
            cell_ref = message.get("cellRef")
            value = message.get("value")
            formula = message.get("formula")
            user_id = self.usernames[sheet_id].get(websocket)
            
            # Store old value for history
            old_cell = self.spreadsheet_service.get_cell_value(sheet_id, cell_ref)
            old_value = old_cell.value if old_cell else None
            
            cell = self.collaboration_service.apply_edit(
                sheet_id, cell_ref, value, formula, user_id)
            
            # Log edit in history
            from main import history_service
            history_service.log_edit(sheet_id, cell_ref, old_value, cell.value, user_id)
            
            # Broadcast updated cell to all clients
            await self.broadcast(sheet_id, {
                "type": "cell_update",
                "cellRef": cell_ref,
                "value": cell.value,
                "formula": cell.formula,
                "version": cell.version,
                "userId": user_id,
            })
        elif msg_type == "cursor_update":
            user_id = self.usernames[sheet_id].get(websocket)
            cursor_pos = message.get("position")
            await self.broadcast(sheet_id, {
                "type": "cursor_update",
                "userId": user_id,
                "position": cursor_pos,
            })
        elif msg_type == "comment_add":
            cell_ref = message.get("cellRef")
            text = message.get("text")
            user_id = self.usernames[sheet_id].get(websocket)
            
            # Add comment
            from main import comment_service
            comment = comment_service.add_comment(sheet_id, cell_ref, user_id, text)
            
            # Broadcast comment to all clients
            await self.broadcast(sheet_id, {
                "type": "comment_added",
                "cellRef": cell_ref,
                "commentId": comment.comment_id,
                "userId": user_id,
                "text": text,
                "timestamp": comment.timestamp
            })
        elif msg_type == "history_request":
            cell_ref = message.get("cellRef")
            user_id = self.usernames[sheet_id].get(websocket)
            
            # Get cell history
            from main import history_service
            history = history_service.get_history(sheet_id, cell_ref)
            
            # Send history directly to the requesting client
            await websocket.send_json({
                "type": "history_response",
                "cellRef": cell_ref,
                "history": [
                    {
                        "oldValue": entry.old_value,
                        "newValue": entry.new_value,
                        "userId": entry.user_id,
                        "timestamp": entry.timestamp
                    } for entry in history
                ]
            })
