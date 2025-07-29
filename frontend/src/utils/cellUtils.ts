export function colToIndex(col: string): number {
  let idx = 0;
  for (let i = 0; i < col.length; i++) {
    idx = idx * 26 + (col.charCodeAt(i) - 64);
  }
  return idx - 1;
}

export function indexToCol(index: number): string {
  let col = '';
  index += 1;
  while (index > 0) {
    const rem = (index - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    index = Math.floor((index - 1) / 26);
  }
  return col;
}

export function parseCellRef(cellRef: string): { col: string; row: number } {
  // 'A1' -> { col: 'A', row: 1 }
  const match = cellRef.match(/^([A-Z]+)(\d+)$/i);
  if (!match) throw new Error('Invalid cell reference');
  return { col: match[1], row: parseInt(match[2], 10) };
}

export function getCellRangeRefs(start: string, end: string): string[] {
  // Returns array of cell refs from start ('A1') to end ('A10') in range
  const { col: startCol, row: startRow } = parseCellRef(start);
  const { col: endCol, row: endRow } = parseCellRef(end);

  const colStartIdx = colToIndex(startCol);
  const colEndIdx = colToIndex(endCol);

  const refs: string[] = [];
  for (let c = colStartIdx; c <= colEndIdx; c++) {
    for (let r = startRow; r <= endRow; r++) {
      refs.push(`${indexToCol(c)}${r}`);
    }
  }
  return refs;
}
