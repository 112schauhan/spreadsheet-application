import pytest
from spreadsheet import SpreadsheetService
import csv
import io

@pytest.fixture
def spreadsheet_service():
    return SpreadsheetService()

@pytest.fixture
def simulate_csv_import_export():
    # This fixture doesn't need to return anything, it's just used as a marker
    pass

def test_csv_import_export(simulate_csv_import_export, spreadsheet_service):
    sheet_id = "csv_test"
    csv_content = "Name,Age\nAlice,30\nBob,25\n"
    # Simulate import
    f = io.StringIO(csv_content)
    reader = csv.reader(f)
    sheet = spreadsheet_service.get_or_create_sheet(sheet_id)
    sheet.cells.clear()

    row_num = 1
    for row in reader:
        col_num = 0
        for cell_value in row:
            col_char = chr(ord('A') + col_num)
            spreadsheet_service.set_cell_value(sheet_id, f"{col_char}{row_num}", cell_value)
            col_num += 1
        row_num += 1

    # Verify some cells - OUTSIDE the loop
    cell_A1 = spreadsheet_service.get_cell_value(sheet_id, "A1")
    assert cell_A1.value == "Name"
    cell_B2 = spreadsheet_service.get_cell_value(sheet_id, "B2")
    # The cell is converted to a number, so check numeric equality
    assert float(30) == cell_B2.value    # Simulate export: extract values row-wise to CSV string
    output = io.StringIO()
    writer = csv.writer(output)
    for row in range(1, sheet.rows + 1):
        row_data = []
        for col in range(sheet.columns):
            cell_ref = f"{chr(ord('A') + col)}{row}"
            cell = sheet.cells.get(cell_ref)
            val = cell.value if cell else ""
            row_data.append(str(val))
        writer.writerow(row_data)
    csv_exported = output.getvalue()
    assert "Alice" in csv_exported
    assert "Bob" in csv_exported