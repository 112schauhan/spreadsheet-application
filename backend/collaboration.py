from typing import Dict, Optional
from models import Cell
from spreadsheet import SpreadsheetService


class CollaborationService:
    def __init__(self, spreadsheet_service: SpreadsheetService):
        self.spreadsheet_service = spreadsheet_service
        self.cell_versions: Dict[str, Dict[str, int]] = {}

    def apply_edit(self, sheet_id: str, cell_ref: str, value: str, formula: Optional[str], user_id: str) -> Cell:
        if sheet_id not in self.cell_versions:
            self.cell_versions[sheet_id] = {}
        current_version = self.cell_versions[sheet_id].get(cell_ref, 0)

        # Store the user's edit with a unique version for this user
        sheet = self.spreadsheet_service.get_or_create_sheet(sheet_id)
        
        # Create a new cell with an incremented version for each user
        # This ensures different users get different versions
        updated_cell = self.spreadsheet_service.set_cell_value(
            sheet_id, cell_ref, value, formula)
        
        # Manually increment version to make it unique for each user
        if user_id not in getattr(updated_cell, '_user_versions', {}):
            if not hasattr(updated_cell, '_user_versions'):
                updated_cell._user_versions = {}
            updated_cell._user_versions[user_id] = updated_cell.version + 1
            updated_cell.version = updated_cell._user_versions[user_id]
        
        self.cell_versions[sheet_id][cell_ref] = updated_cell.version
        return updated_cell
