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

        sheet = self.spreadsheet_service.get_or_create_sheet(sheet_id)
        cell = sheet.cells.get(cell_ref)
        existing_version = cell.version if cell else 0

        # For now, simple last-write-wins; ignore stale versions
        updated_cell = self.spreadsheet_service.set_cell_value(
            sheet_id, cell_ref, value, formula)
        self.cell_versions[sheet_id][cell_ref] = updated_cell.version
        return updated_cell
