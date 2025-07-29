import { type GridState, type CellData } from "../types/grid.types";

export async function fetchGrid(sheetId: string): Promise<GridState> {
  const response = await fetch(`/api/sheet/${sheetId}`);
  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Failed to fetch sheet data: ${errMsg}`);
  }
  const gridState = (await response.json()) as GridState;
  return gridState;
}

/**
 * Update a single cell in the spreadsheet.
 * Note: In a real-time collaborative app, cell updates should ideally be sent via WebSocket.
 * This REST API call can be fallback or for batch updates.
 */
export async function updateCell(
  sheetId: string,
  cellRef: string,
  value: string | number,
  formula?: string
): Promise<CellData> {
  const response = await fetch(`/api/sheet/${sheetId}/cell/${cellRef}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value, formula }),
  });
  if (!response.ok) {
    const errMsg = await response.text();
    throw new Error(`Failed to update cell: ${errMsg}`);
  }
  return (await response.json()) as CellData;
}
