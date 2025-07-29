/* eslint-disable @typescript-eslint/no-explicit-any */

export function cellsToTSV(cellRefs: string[], data: Record<string, any>): string {
  return cellRefs.map(ref => String(data[ref]?.value ?? '')).join('\t');
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

import { parseCellRef, colToIndex, indexToCol } from './cellUtils';
