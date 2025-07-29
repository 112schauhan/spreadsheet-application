export interface HistoryEntry {
  cellRef: string;
  oldValue: string | number | null;
  newValue: string | number | null;
  oldFormula?: string;
  newFormula?: string;
  userId: string;
  timestamp: number;
}

export interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
}
