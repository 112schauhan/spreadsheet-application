// Utility functions for cell selection and range operations

export interface CellCoordinate {
  row: number;
  col: number;
}

/**
 * Parse cell reference like "A1" into coordinates
 */
export function parseCellRef(cellRef: string): CellCoordinate | null {
  const match = cellRef.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  const colLetters = match[1];
  const rowNumber = parseInt(match[2], 10);
  
  // Convert column letters to number (A=0, B=1, etc.)
  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 65 + 1);
  }
  col -= 1; // Convert to 0-based
  
  return { row: rowNumber - 1, col };
}

/**
 * Convert coordinates to cell reference
 */
export function coordinatesToCellRef(coord: CellCoordinate): string {
  let col = coord.col;
  let colLetters = '';
  
  while (col >= 0) {
    colLetters = String.fromCharCode(65 + (col % 26)) + colLetters;
    col = Math.floor(col / 26) - 1;
  }
  
  return colLetters + (coord.row + 1);
}

/**
 * Get column letter from column index
 */
export function getColumnLetter(colIndex: number): string {
  let col = colIndex;
  let colLetters = '';
  
  while (col >= 0) {
    colLetters = String.fromCharCode(65 + (col % 26)) + colLetters;
    col = Math.floor(col / 26) - 1;
  }
  
  return colLetters;
}

/**
 * Get column index from column letter
 */
export function getColumnIndex(colLetter: string): number {
  let col = 0;
  for (let i = 0; i < colLetter.length; i++) {
    col = col * 26 + (colLetter.charCodeAt(i) - 65 + 1);
  }
  return col - 1; // Convert to 0-based
}

/**
 * Check if a cell is within a range
 */
export function isCellInRange(cellRef: string, range: { start: string; end: string }): boolean {
  const cell = parseCellRef(cellRef);
  const start = parseCellRef(range.start);
  const end = parseCellRef(range.end);
  
  if (!cell || !start || !end) return false;
  
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);
  
  return cell.row >= minRow && cell.row <= maxRow && 
         cell.col >= minCol && cell.col <= maxCol;
}

/**
 * Check if a cell is in a selected row
 */
export function isCellInSelectedRow(cellRef: string, selectedRows: number[]): boolean {
  const cell = parseCellRef(cellRef);
  if (!cell) return false;
  return selectedRows.includes(cell.row);
}

/**
 * Check if a cell is in a selected column
 */
export function isCellInSelectedColumn(cellRef: string, selectedColumns: string[]): boolean {
  const cell = parseCellRef(cellRef);
  if (!cell) return false;
  const colLetter = getColumnLetter(cell.col);
  return selectedColumns.includes(colLetter);
}

/**
 * Check if a cell is selected (in any way)
 */
export function isCellSelected(
  cellRef: string, 
  selection: {
    selectedCell: string | null;
    selectedCells: string[];
    selectedRange: { start: string; end: string } | null;
    selectedRanges: { start: string; end: string }[];
    selectedRows: number[];
    selectedColumns: string[];
  }
): boolean {
  // Direct cell selection
  if (selection.selectedCell === cellRef) return true;
  
  // Multi-cell selection
  if (selection.selectedCells.includes(cellRef)) return true;
  
  // Range selection
  if (selection.selectedRange && isCellInRange(cellRef, selection.selectedRange)) return true;
  
  // Multiple ranges
  if (selection.selectedRanges.some(range => isCellInRange(cellRef, range))) return true;
  
  // Row selection
  if (isCellInSelectedRow(cellRef, selection.selectedRows)) return true;
  
  // Column selection
  if (isCellInSelectedColumn(cellRef, selection.selectedColumns)) return true;
  
  return false;
}

/**
 * Get all cells in a range
 */
export function getCellsInRange(range: { start: string; end: string }): string[] {
  const start = parseCellRef(range.start);
  const end = parseCellRef(range.end);
  
  if (!start || !end) return [];
  
  const cells: string[] = [];
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);
  
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push(coordinatesToCellRef({ row, col }));
    }
  }
  
  return cells;
}

/**
 * Normalize range so start is always top-left and end is bottom-right
 */
export function normalizeRange(range: { start: string; end: string }): { start: string; end: string } {
  const start = parseCellRef(range.start);
  const end = parseCellRef(range.end);
  
  if (!start || !end) return range;
  
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);
  
  return {
    start: coordinatesToCellRef({ row: minRow, col: minCol }),
    end: coordinatesToCellRef({ row: maxRow, col: maxCol })
  };
}
