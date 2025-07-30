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
    if (value.trim() === "") {
      return { isValid: true }; // Allow blank
    }
    
    // Enhanced date validation
    const dateRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const match = value.trim().match(dateRegex);
    
    if (!match) {
      return { isValid: false, error: "Invalid date format — use DD-MM-YYYY" };
    }
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Basic range checks
    if (month < 1 || month > 12) {
      return { isValid: false, error: "Month must be between 1-12" };
    }
    
    if (day < 1 || day > 31) {
      return { isValid: false, error: "Day must be between 1-31" };
    }
    
    // Days in month validation
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // Check for leap year
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (isLeapYear) {
      daysInMonth[1] = 29; // February has 29 days in leap year
    }
    
    if (day > daysInMonth[month - 1]) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      return { 
        isValid: false, 
        error: `${monthNames[month - 1]} ${year} only has ${daysInMonth[month - 1]} days` 
      };
    }
    
    // Create date object to verify it's a real date
    const dateObj = new Date(year, month - 1, day);
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
      return { isValid: false, error: "Invalid date" };
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
