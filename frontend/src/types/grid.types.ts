import type { CellFormatting } from "./formatting.types";

export type CellValue = string | number | null;

export interface CellData {
  value: CellValue;
  formula?: string;
  version?: number;
  formatting?: CellFormatting;
}

export interface GridState {
  rows: number;
  columns: number;
  cells: Record<string, CellData>;
  visibleRange: {
    rows: [number, number];
    cols: [number, number];
  };
}