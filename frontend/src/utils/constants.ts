export const DEFAULT_ROWS = 100;
export const DEFAULT_COLUMNS = 26;
export const COLUMN_HEADERS = Array.from({ length: DEFAULT_COLUMNS }, (_, i) =>
  String.fromCharCode(65 + i)
);

export const SUPPORTED_FORMULAS = ['SUM', 'AVERAGE', 'COUNT'];

export const MAX_CELL_LENGTH = 1024;
