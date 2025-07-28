import pytest
from spreadsheet import SpreadsheetService
from models import CellType, Spreadsheet

@pytest.fixture
def sheet_id():
    return "testsheet"

@pytest.fixture
def service():
    return SpreadsheetService()

def test_set_and_get_cell_value(service, sheet_id):
    cell = service.set_cell_value(sheet_id, "A1", "123")
    assert cell.value == 123
    assert cell.cell_type == CellType.NUMBER

    cell2 = service.get_cell_value(sheet_id, "A1")
    assert cell2.value == 123

def test_set_text_cell_value(service, sheet_id):
    cell = service.set_cell_value(sheet_id, "B2", "Hello")
    assert cell.value == "Hello"
    assert cell.cell_type == CellType.TEXT

def test_formula_sum(service, sheet_id):
    for i in range(1, 6):
        service.set_cell_value(sheet_id, f"A{i}", str(i))
    val = service.evaluate_formula(service.get_or_create_sheet(sheet_id), "SUM(A1:A5)")
    assert val == 15

def test_formula_average(service, sheet_id):
    for i in range(1, 6):
        service.set_cell_value(sheet_id, f"A{i}", str(i))
    val = service.evaluate_formula(service.get_or_create_sheet(sheet_id), "AVERAGE(A1:A5)")
    assert val == pytest.approx(3.0)

def test_formula_count(service, sheet_id):
    for i in range(1, 6):
        service.set_cell_value(sheet_id, f"A{i}", str(i))
    val = service.evaluate_formula(service.get_or_create_sheet(sheet_id), "COUNT(A1:A5)")
    assert val == 5

def test_invalid_formula(service, sheet_id):
    with pytest.raises(Exception):
        service.evaluate_formula(service.get_or_create_sheet(sheet_id), "INVALID(A1:A5)")

def test_add_delete_row(service, sheet_id):
    original_rows = service.get_or_create_sheet(sheet_id).rows
    service.add_row(sheet_id)
    assert service.get_or_create_sheet(sheet_id).rows == original_rows + 1
    service.delete_row(sheet_id, original_rows + 1)
    assert service.get_or_create_sheet(sheet_id).rows == original_rows

def test_add_delete_column(service, sheet_id):
    original_cols = service.get_or_create_sheet(sheet_id).columns
    service.add_column(sheet_id)
    assert service.get_or_create_sheet(sheet_id).columns == original_cols + 1
    col_char = chr(ord('A') + original_cols)  # last added col
    service.delete_column(sheet_id, col_char)
    assert service.get_or_create_sheet(sheet_id).columns == original_cols

def test_sort_column_ascending(service, sheet_id):
    service.set_cell_value(sheet_id, "A1", "5")
    service.set_cell_value(sheet_id, "A2", "3")
    service.set_cell_value(sheet_id, "A3", "NULL")
    service.set_cell_value(sheet_id, "A4", "7")
    service.set_cell_value(sheet_id, "A5", "1")

    service.sort_column(sheet_id, "A", ascending=True)
    sheet = service.get_or_create_sheet(sheet_id)
    values_sorted = [sheet.cells.get(f"A{i}").value for i in range(1, 6)]
    assert values_sorted == [1, 3, 5, 7, "NULL"] or values_sorted[:-1] == [1, 3, 5, 7]