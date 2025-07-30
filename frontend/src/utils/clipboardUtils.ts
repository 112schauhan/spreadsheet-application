/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseCellRef, colToIndex, indexToCol } from './cellUtils';

export function cellsToTSV(cellRefs: string[], data: Record<string, any>): string {
  if (cellRefs.length === 0) return '';
  
  // If single cell, just return its value
  if (cellRefs.length === 1) {
    return String(data[cellRefs[0]]?.value ?? '');
  }
  
  // For multiple cells, organize them into a 2D structure
  const cellCoords = cellRefs.map(ref => {
    const parsed = parseCellRef(ref);
    return {
      ref,
      col: colToIndex(parsed.col),
      row: parsed.row - 1, // Convert to 0-based
      value: String(data[ref]?.value ?? '')
    };
  });
  
  // Find bounds
  const minRow = Math.min(...cellCoords.map(c => c.row));
  const maxRow = Math.max(...cellCoords.map(c => c.row));
  const minCol = Math.min(...cellCoords.map(c => c.col));
  const maxCol = Math.max(...cellCoords.map(c => c.col));
  
  // Create 2D array
  const rows: string[][] = [];
  for (let r = minRow; r <= maxRow; r++) {
    const row: string[] = [];
    for (let c = minCol; c <= maxCol; c++) {
      const cell = cellCoords.find(coord => coord.row === r && coord.col === c);
      row.push(cell ? cell.value : '');
    }
    rows.push(row);
  }
  
  // Convert to TSV
  return rows.map(row => row.join('\t')).join('\n');
}

export function tsvToCells(tsv: string, topLeftRef: string): Record<string, any> {
  const rows = tsv.split('\n');
  const { col: startCol, row: startRow } = parseCellRef(topLeftRef);
  const updates: Record<string, any> = {};

  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].split('\t');
    for (let j = 0; j < cols.length; j++) {
      const ref = `${indexToCol(colToIndex(startCol) + j)}${startRow + i}`;
      updates[ref] = { value: cols[j] };
    }
  }
  return updates;
}
