import { type CellData } from '../types/grid.types';

export function sortRowsByColumn(
  data: Record<string, CellData>,
  column: string,
  rows: number[],
  ascending = true
): number[] {
  return [...rows].sort((a, b) => {
    const cellA = data[`${column}${a}`]?.value;
    const cellB = data[`${column}${b}`]?.value;
    if (cellA == null) return ascending ? 1 : -1;
    if (cellB == null) return ascending ? -1 : 1;
    if (typeof cellA === 'number' && typeof cellB === 'number') {
      return ascending ? cellA - cellB : cellB - cellA;
    }
    return ascending
      ? String(cellA).localeCompare(String(cellB))
      : String(cellB).localeCompare(String(cellA));
  });
}
