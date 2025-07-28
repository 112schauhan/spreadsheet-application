import pytest
from history import HistoryService

@pytest.fixture
def history_service():
    return HistoryService()

def test_log_and_get_history(history_service):
    sheet_id = "sheet_hist"
    cell_ref = "C3"
    user_id = "user_abc"

    history_service.log_edit(sheet_id, cell_ref, old_value="old", new_value="new", user_id=user_id)
    history_service.log_edit(sheet_id, cell_ref, old_value="new", new_value="newer", user_id=user_id)

    history = history_service.get_history(sheet_id, cell_ref)
    assert len(history) == 2
    assert history[0].old_value == "old"
    assert history[0].new_value == "new"
    assert history[1].new_value == "newer"

def test_get_empty_history(history_service):
    hist = history_service.get_history("sheet_empty", "A1")
    assert hist == []