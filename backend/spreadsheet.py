import re
from typing import Optional, List, Dict
from models import Spreadsheet, Cell, CellType


class FormulaError(Exception):
    pass


class SpreadsheetService:
    def __init__(self):
        self.spreadsheets: Dict[str, Spreadsheet] = {}

    def get_or_create_sheet(self, sheet_id: str) -> Spreadsheet:
        if sheet_id not in self.spreadsheets:
            self.spreadsheets[sheet_id] = Spreadsheet()
        return self.spreadsheets[sheet_id]

    def validate_cell_ref(self, cell_ref: str) -> bool:
        return re.match(r"^[A-Z]{1}[1-9][0-9]{0,1}$", cell_ref) is not None

    def set_cell_value(self, sheet_id: str, cell_ref: str, value: str, formula: Optional[str] = None) -> Cell:
        sheet = self.get_or_create_sheet(sheet_id)
        if not self.validate_cell_ref(cell_ref):
            raise ValueError(f"Invalid cell reference: {cell_ref}")

        cell = sheet.cells.get(cell_ref, Cell())
        cell.version += 1
        if formula:
            cell.cell_type = CellType.FORMULA
            cell.formula = formula
            cell.value = self.evaluate_formula(sheet, formula)
        else:
            try:
                num_val = float(value)
                cell.cell_type = CellType.NUMBER
                cell.value = num_val
                cell.formula = None
            except Exception:
                cell.cell_type = CellType.TEXT
                cell.value = value
                cell.formula = None

        sheet.cells[cell_ref] = cell
        return cell

    def get_cell_value(self, sheet_id: str, cell_ref: str) -> Cell:
        sheet = self.get_or_create_sheet(sheet_id)
        return sheet.cells.get(cell_ref, Cell())

    def evaluate_formula(self, sheet: Spreadsheet, formula: str) -> float:
        formula = formula.strip().upper()
        if formula.startswith("SUM(") and formula.endswith(")"):
            range_ref = formula[4:-1]
            return self._sum_range(sheet, range_ref)
        elif formula.startswith("AVERAGE(") and formula.endswith(")"):
            range_ref = formula[8:-1]
            return self._average_range(sheet, range_ref)
        elif formula.startswith("COUNT(") and formula.endswith(")"):
            range_ref = formula[6:-1]
            return self._count_range(sheet, range_ref)
        else:
            raise FormulaError(f"Unsupported formula: {formula}")

    def _parse_range(self, range_ref: str) -> List[str]:
        m = re.match(r"([A-Z])([1-9][0-9]?):([A-Z])([1-9][0-9]?)", range_ref)
        if not m:
            raise FormulaError(f"Invalid range: {range_ref}")
        col_start, row_start, col_end, row_end = m.groups()
        if col_start != col_end:
            raise FormulaError("Only single column ranges supported")

        start, end = int(row_start), int(row_end)
        if start > end:
            start, end = end, start

        return [f"{col_start}{i}" for i in range(start, end + 1)]

    def _sum_range(self, sheet: Spreadsheet, range_ref: str) -> float:
        cells = self._parse_range(range_ref)
        total = 0.0
        for ref in cells:
            cell = sheet.cells.get(ref)
            if cell and cell.cell_type == CellType.NUMBER and cell.value is not None:
                total += cell.value
        return total

    def _average_range(self, sheet: Spreadsheet, range_ref: str) -> float:
        cells = self._parse_range(range_ref)
        values = [
            sheet.cells[ref].value
            for ref in cells
            if ref in sheet.cells and sheet.cells[ref].cell_type == CellType.NUMBER and sheet.cells[ref].value is not None
        ]
        return sum(values) / len(values) if values else 0.0

    def _count_range(self, sheet: Spreadsheet, range_ref: str) -> int:
        cells = self._parse_range(range_ref)
        count = 0
        for ref in cells:
            if ref in sheet.cells and sheet.cells[ref].value is not None:
                count += 1
        return count

    def add_row(self, sheet_id: str) -> None:
        sheet = self.get_or_create_sheet(sheet_id)
        if sheet.rows < 1000:
            sheet.rows += 1

    def delete_row(self, sheet_id: str, row_num: int) -> None:
        sheet = self.get_or_create_sheet(sheet_id)
        if 1 <= row_num <= sheet.rows:
            for col in range(sheet.columns):
                cell_ref = f"{chr(ord('A') + col)}{row_num}"
                if cell_ref in sheet.cells:
                    del sheet.cells[cell_ref]
            sheet.rows -= 1

    def add_column(self, sheet_id: str) -> None:
        sheet = self.get_or_create_sheet(sheet_id)
        if sheet.columns < 26:
            sheet.columns += 1

    def delete_column(self, sheet_id: str, col_char: str) -> None:
        sheet = self.get_or_create_sheet(sheet_id)
        if "A" <= col_char <= chr(ord("A") + sheet.columns - 1):
            for row in range(1, sheet.rows+1):
                cell_ref = f"{col_char}{row}"
                if cell_ref in sheet.cells:
                    del sheet.cells[cell_ref]
            sheet.columns -= 1

    def sort_column(self, sheet_id: str, col_char: str, ascending: bool = True) -> None:
        sheet = self.get_or_create_sheet(sheet_id)
        rows = list(range(1, sheet.rows + 1))
        values = []
        for row in rows:
            cell_ref = f"{col_char}{row}"
            cell = sheet.cells.get(cell_ref)
            val = cell.value if cell else None
            values.append((row, val))

        values_sorted = sorted(values, key=lambda x: (
            x[1] is None, x[1]), reverse=not ascending)
        for i, (orig_row, val) in enumerate(values_sorted):
            target_ref = f"{col_char}{rows[i]}"
            if val is None:
                sheet.cells.pop(target_ref, None)
            else:
                cell = sheet.cells.get(target_ref, Cell())
                cell.value = val
                cell.cell_type = CellType.NUMBER if isinstance(
                    val, (int, float)) else CellType.TEXT
                sheet.cells[target_ref] = cell
