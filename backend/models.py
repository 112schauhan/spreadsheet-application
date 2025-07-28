from typing import Optional, Dict, List, Union
from dataclasses import dataclass, field
from enum import Enum

class CellType(str, Enum):
    TEXT = "text"
    NUMBER = "number"
    DATE = "date"
    FORMULA = "formula"

@dataclass
class Cell:
    value: Optional[Union[str, float]] = None
    formula: Optional[str] = None
    cell_type: CellType = CellType.TEXT
    version: int = 0

@dataclass
class Spreadsheet:
    cells: Dict[str, Cell] = field(default_factory=dict)
    rows: int = 100
    columns: int = 25  # Change from 26 to 25 to allow adding one more column

@dataclass
class User:
    user_id: str
    username: str
    color: str

@dataclass
class Comment:
    comment_id: str
    user_id: str
    cell_ref: str
    text: str
    timestamp: float

@dataclass
class HistoryEntry:
    cell_ref: str
    old_value: Optional[Union[str, float]]
    new_value: Optional[Union[str, float]]
    user_id: str
    timestamp: float
