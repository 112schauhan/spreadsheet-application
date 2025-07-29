export const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export function isNavigationKey(key: string): boolean {
  return ARROW_KEYS.includes(key) || key === 'Tab' || key === 'Enter';
}

export function nextCell(
  key: string,
  colIdx: number,
  rowIdx: number,
  maxCols: number,
  maxRows: number
) {
  switch (key) {
    case 'ArrowUp':
      return { col: colIdx, row: Math.max(rowIdx - 1, 0) };
    case 'ArrowDown':
      return { col: colIdx, row: Math.min(rowIdx + 1, maxRows - 1) };
    case 'ArrowLeft':
      return { col: Math.max(colIdx - 1, 0), row: rowIdx };
    case 'ArrowRight':
    case 'Tab':
      return { col: Math.min(colIdx + 1, maxCols - 1), row: rowIdx };
    case 'Enter':
      return { col: colIdx, row: Math.min(rowIdx + 1, maxRows - 1) };
    default:
      return { col: colIdx, row: rowIdx };
  }
}