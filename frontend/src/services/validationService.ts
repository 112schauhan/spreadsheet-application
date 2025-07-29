export function validateCellValue(
  value: string,
  expectedType: 'number' | 'date' | 'text' | 'formula' = 'text'
): { isValid: boolean; error?: string } {
  if (expectedType === 'number') {
    if (value.trim() === "") {
      return { isValid: true }; // Allow blank if allowed
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return { isValid: false, error: "Invalid number format" };
    }
    return { isValid: true };
  }

  if (expectedType === 'date') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value.trim())) {
      return { isValid: false, error: "Invalid date format — use YYYY-MM-DD" };
    }
    const dateObj = new Date(value.trim());
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: "Date is not valid" };
    }
    return { isValid: true };
  }

  if (expectedType === 'formula') {
    if (!value.startsWith('=')) {
      return { isValid: false, error: "Formula must start with '='." };
    }

    const formulaBody = value.substring(1).toUpperCase();
    const supportedFns = ['SUM', 'AVERAGE', 'COUNT'];
    const matched = supportedFns.some(fn =>
      formulaBody.startsWith(fn + '(') && formulaBody.endsWith(')')
    );
    if (!matched) {
      return { isValid: false, error: "Supported: =SUM(), =AVERAGE(), =COUNT() with valid range" };
    }
    return { isValid: true };
  }

  return { isValid: true };
}

export function validateFormula(formula: string): { isValid: boolean; error?: string } {
  if (!formula.trim().startsWith('=')) {
    return { isValid: false, error: "Formula must start with '='." };
  }
  const formulaBody = formula.trim().substring(1).toUpperCase();
  const supportedFns = ['SUM', 'AVERAGE', 'COUNT'];
  const matched = supportedFns.some(fn =>
    formulaBody.startsWith(fn + '(') && formulaBody.endsWith(')')
  );
  if (!matched) {
    return { isValid: false, error: "Supported: =SUM(A1:A10), =AVERAGE(...), =COUNT(...)" };
  }
  return { isValid: true };
}
