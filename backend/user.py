import uuid
from typing import Dict, List, Optional
from models import User

class UserService:
    def __init__(self):
        self.users_per_sheet: Dict[str, Dict[str, User]] = {}

    def add_user(self, sheet_id: str, username: str, user_id: Optional[str] = None, color: Optional[str] = None) -> User:
        if sheet_id not in self.users_per_sheet:
            self.users_per_sheet[sheet_id] = {}
            
        # Use provided user_id or generate new one
        if user_id is None:
            user_id = str(uuid.uuid4())
            
        # Use provided color or assign from defaults
        if color is None:
            colors = ["#ef4444", "#3b82f6", "#22c55e", "#f97316", "#8b5cf6"]  # red, blue, green, orange, purple
            color = colors[len(self.users_per_sheet[sheet_id]) % len(colors)]
            
        user = User(user_id=user_id, username=username, color=color)
        self.users_per_sheet[sheet_id][user_id] = user
        return user

    def remove_user(self, sheet_id: str, user_id: str) -> None:
        if sheet_id in self.users_per_sheet:
            self.users_per_sheet[sheet_id].pop(user_id, None)

    def get_users(self, sheet_id: str) -> List[User]:
        return list(self.users_per_sheet.get(sheet_id, {}).values())

    def get_user(self, sheet_id: str, user_id: str) -> Optional[User]:
        return self.users_per_sheet.get(sheet_id, {}).get(user_id)
