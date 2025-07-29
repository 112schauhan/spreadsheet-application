export interface FormulaState {
  formulaInput: string;
  errors: string | null;
}

export interface ParsedFormula {
  functionName: string;
  args: string[];
}

export type SupportedFunctions = 'SUM' | 'AVERAGE' | 'COUNT'; // Extend as needed
