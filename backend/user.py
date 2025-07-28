import uuid
from typing import Dict, List
from models import User

class UserService:
    def __init__(self):
        self.users_per_sheet: Dict[str, Dict[str, User]] = {}

    def add_user(self, sheet_id: str, username: str) -> User:
        if sheet_id not in self.users_per_sheet:
            self.users_per_sheet[sheet_id] = {}
        user_id = str(uuid.uuid4())
        colors = ["red", "blue", "green", "orange", "purple"]
        color = colors[len(self.users_per_sheet[sheet_id]) % len(colors)]
        user = User(user_id=user_id, username=username, color=color)
        self.users_per_sheet[sheet_id][user_id] = user
        return user

    def remove_user(self, sheet_id: str, user_id: str) -> None:
        if sheet_id in self.users_per_sheet:
            self.users_per_sheet[sheet_id].pop(user_id, None)

    def get_users(self, sheet_id: str) -> List[User]:
        return list(self.users_per_sheet.get(sheet_id, {}).values())
