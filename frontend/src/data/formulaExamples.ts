export const formulaExamples: Array<{ label: string; formula: string; explanation: string }> = [
  {
    label: "Sum Range",
    formula: "=SUM(B2:B10)",
    explanation: "Adds up all the values from B2 to B10."
  },
  {
    label: "Average",
    formula: "=AVERAGE(C2:C10)",
    explanation: "Calculates the average of values from C2 to C10."
  },
  {
    label: "Count Non-empty",
    formula: "=COUNT(A2:A20)",
    explanation: "Counts all non-empty cells from A2 to A20."
  },
  {
    label: "Single cell ref",
    formula: "=B2",
    explanation: "Returns the current value from cell B2."
  }
];
