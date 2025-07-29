import { getCellRangeRefs } from './cellUtils';

export function isFormula(value: string): boolean {
  return value.startsWith('=');
}

interface CellLookup {
  (cellRef: string): number | string | undefined;
}

export function evaluateFormula(
  formula: string,
  cellGetter: CellLookup
): number | string | Error {
  try {
    const match = formula.match(/^=(\w+)\(([^)]+)\)$/i);
    if (!match) return new Error('Invalid formula');
    const fn = match[1].toUpperCase();
    const range = match[2];

    let refs: string[] = [];
    if (range.includes(':')) {
      const [start, end] = range.split(':');
      refs = getCellRangeRefs(start.trim(), end.trim());
    } else {
      refs = [range.trim()];
    }
    const values = refs.map(cellGetter).map(Number).filter(v => !isNaN(v));

    switch (fn) {
      case 'SUM':
        return values.reduce((a, b) => a + b, 0);
      case 'AVERAGE':
        return values.length
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0;
      case 'COUNT':
        return refs.map(cellGetter).filter(v => v != null && v !== '').length;
      default:
        return new Error('Unsupported formula');
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e:any) {
    return new Error('Formula evaluation error',e);
  }
}

export function validateFormulaInput(input: string): boolean {
  return /^=\w+\(.+\)$/.test(input);
}
