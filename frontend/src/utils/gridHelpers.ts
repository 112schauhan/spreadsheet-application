// gridHelpers.ts

import { type CellData } from '../types/grid.types';

export function createEmptyGrid(rows: number, columns: number): Record<string, CellData> {
  const cells: Record<string, CellData> = {};
  for (let r = 1; r <= rows; r++) {
    for (let c = 0; c < columns; c++) {
      const col = String.fromCharCode(65 + c);
      const ref = `${col}${r}`;
      cells[ref] = { value: '' };
    }
  }
  return cells;
}

export function isCellInRange(cell: string, range: { start: string; end: string }): boolean {
  // Simple check for range selection
  const { row: sr, col: sc } = parseCellRef(range.start);
  const { row: er, col: ec } = parseCellRef(range.end);
  const { row: cr, col: cc } = parseCellRef(cell);

  const minRow = Math.min(sr, er);
  const maxRow = Math.max(sr, er);
  const minCol = Math.min(colToIndex(sc), colToIndex(ec));
  const maxCol = Math.max(colToIndex(sc), colToIndex(ec));
  return cr >= minRow && cr <= maxRow && colToIndex(cc) >= minCol && colToIndex(cc) <= maxCol;
}

// Import helpers reused from cellUtils
import { parseCellRef, colToIndex } from './cellUtils';
