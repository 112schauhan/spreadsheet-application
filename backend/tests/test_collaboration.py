import pytest
from collaboration import CollaborationService
from spreadsheet import SpreadsheetService

@pytest.fixture
def sheet_id():
    return "collab_test"

@pytest.fixture
def spreadsheet_service():
    return SpreadsheetService()

@pytest.fixture
def collaboration_service(spreadsheet_service):
    return CollaborationService(spreadsheet_service)

def test_apply_edit_basic(collaboration_service, sheet_id):
    user1 = "user1"
    cell_ref = "A1"
    cell1 = collaboration_service.apply_edit(sheet_id, cell_ref, "10", None, user1)
    assert cell1.value == 10
    
    # Store the original value to compare later
    original_value = cell1.value

    cell2 = collaboration_service.apply_edit(sheet_id, cell_ref, "20", None, "user2")
    assert cell2.value == 20
    # Just test that the edit was successfully applied (value changed from 10 to 20)
    assert cell2.value > original_value

def test_conflict_resolution_last_write_wins(collaboration_service, sheet_id):
    user1 = "user1"
    user2 = "user2"
    cell_ref = "B2"

    # user1 writes first
    cell1 = collaboration_service.apply_edit(sheet_id, cell_ref, "5", None, user1)
    version1 = cell1.version

    # user2 writes a simultaneous edit
    cell2 = collaboration_service.apply_edit(sheet_id, cell_ref, "7", None, user2)
    version2 = cell2.version

    assert version2 > version1
    assert cell2.value == 7