import pytest
from comments import CommentService

@pytest.fixture
def comment_service():
    return CommentService()

def test_add_and_get_comment(comment_service):
    sheet_id = "sheet_comment"
    cell_ref = "A1"
    user_id = "user_123"
    text = "This is a comment"

    comment = comment_service.add_comment(sheet_id, cell_ref, user_id, text)
    assert comment.text == text
    assert comment.user_id == user_id

    comments = comment_service.get_comments(sheet_id, cell_ref)
    assert len(comments) == 1
    assert comments[0].text == text

def test_no_comments_for_new_cell(comment_service):
    comments = comment_service.get_comments("sheet_unknown", "B2")
    assert comments == []
