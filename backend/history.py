import time
from typing import Dict, List
from models import HistoryEntry

class HistoryService:
    def __init__(self):
        # Dict: sheet_id -> cell_ref -> List[HistoryEntry]
        self.history_log: Dict[str, Dict[str, List[HistoryEntry]]] = {}

    def log_edit(self, sheet_id: str, cell_ref: str, old_value, new_value, user_id: str):
        if sheet_id not in self.history_log:
            self.history_log[sheet_id] = {}
        if cell_ref not in self.history_log[sheet_id]:
            self.history_log[sheet_id][cell_ref] = []

        entry = HistoryEntry(
            cell_ref=cell_ref,
            old_value=old_value,
            new_value=new_value,
            user_id=user_id,
            timestamp=time.time(),
        )
        self.history_log[sheet_id][cell_ref].append(entry)

    def get_history(self, sheet_id: str, cell_ref: str) -> List[HistoryEntry]:
        return self.history_log.get(sheet_id, {}).get(cell_ref, [])
