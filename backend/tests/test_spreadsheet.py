import pytest
from spreadsheet import SpreadsheetService
from models import CellType

def test_set_get_cell_value():
    service = SpreadsheetService()
    sheet_id = "sheet1"
    service.set_cell_value(sheet_id, "A1", "123")
    cell = service.get_cell_value(sheet_id, "A1")
    assert cell.value == 123
    assert cell.cell_type == CellType.NUMBER

def test_formula_sum():
    service = SpreadsheetService()
    sheet_id = "sheet2"
    for i in range(1, 6):
        service.set_cell_value(sheet_id, f"A{i}", str(i))
    val = service.evaluate_formula(service.get_or_create_sheet(sheet_id), "SUM(A1:A5)")
    assert val == 15

def test_add_delete_row():
    service = SpreadsheetService()
    sheet_id = "sheet3"
    service.add_row(sheet_id)
    sheet = service.get_or_create_sheet(sheet_id)
    assert sheet.rows == 101
    service.delete_row(sheet_id, 101)
    assert sheet.rows == 100
