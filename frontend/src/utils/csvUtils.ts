import { type CellData } from '../types/grid.types';

export function parseCSV(csv: string): string[][] {
  // Simple CSV parser
  return csv
    .trim()
    .split('\n')
    .map(row => row.split(',').map(cell => cell.trim()));
}

export function toCSV(data: string[][]): string {
  return data.map(row => row.map(cell =>
      cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell)
    .join(','))
    .join('\n');
}

export function gridTo2DArray(
  grid: Record<string, CellData>,
  rows: number,
  columns: number
): string[][] {
  const arr: string[][] = [];
  for (let r = 1; r <= rows; r++) {
    const row: string[] = [];
    for (let c = 0; c < columns; c++) {
      const ref = `${String.fromCharCode(65 + c)}${r}`;
      row.push(String(grid[ref]?.value ?? ''));
    }
    arr.push(row);
  }
  return arr;
}
