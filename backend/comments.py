import time
import uuid
from typing import Dict, List
from models import Comment

class CommentService:
    def __init__(self):
        # Dict map sheet_id -> cell_ref -> List[Comment]
        self.comments: Dict[str, Dict[str, List[Comment]]] = {}

    def add_comment(self, sheet_id: str, cell_ref: str, user_id: str, text: str) -> Comment:
        if sheet_id not in self.comments:
            self.comments[sheet_id] = {}
        if cell_ref not in self.comments[sheet_id]:
            self.comments[sheet_id][cell_ref] = []
        comment_id = str(uuid.uuid4())
        comment = Comment(
            comment_id=comment_id,
            user_id=user_id,
            cell_ref=cell_ref,
            text=text,
            timestamp=time.time()
        )
        self.comments[sheet_id][cell_ref].append(comment)
        return comment

    def get_comments(self, sheet_id: str, cell_ref: str) -> List[Comment]:
        return self.comments.get(sheet_id, {}).get(cell_ref, [])
