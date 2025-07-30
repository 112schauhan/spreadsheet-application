import { type CellData } from "../types/grid.types";

export const demoCells: Record<string, CellData> = {
  // Organized sample data - Employee Performance Dashboard
  
  // Headers
  A1: { value: "Employee ID" },
  B1: { value: "Name" },
  C1: { value: "Department" },
  D1: { value: "Start Date" },
  E1: { value: "Monthly Salary" },
  F1: { value: "Bonus %" },
  G1: { value: "Total Compensation" },
  
  // Employee data
  A2: { value: "EMP001" },
  B2: { value: "John Smith" },
  C2: { value: "Engineering" },
  D2: { value: "15-01-2023" },
  E2: { value: 8500 },
  F2: { value: 12 },
  G2: { value: 9520, formula: "=E2*(1+F2/100)" },
  
  A3: { value: "EMP002" },
  B3: { value: "Sarah Johnson" },
  C3: { value: "Marketing" },
  D3: { value: "22-03-2023" },
  E3: { value: 7200 },
  F3: { value: 15 },
  G3: { value: 8280, formula: "=E3*(1+F3/100)" },
  
  A4: { value: "EMP003" },
  B4: { value: "Mike Davis" },
  C4: { value: "Sales" },
  D4: { value: "08-06-2023" },
  E4: { value: 6800 },
  F4: { value: 18 },
  G4: { value: 8024, formula: "=E4*(1+F4/100)" },
  
  A5: { value: "EMP004" },
  B5: { value: "Lisa Chen" },
  C5: { value: "Engineering" },
  D5: { value: "12-09-2023" },
  E5: { value: 9200 },
  F5: { value: 10 },
  G5: { value: 10120, formula: "=E5*(1+F5/100)" },
  
  A6: { value: "EMP005" },
  B6: { value: "David Wilson" },
  C6: { value: "HR" },
  D6: { value: "03-11-2023" },
  E6: { value: 6500 },
  F6: { value: 8 },
  G6: { value: 7020, formula: "=E6*(1+F6/100)" },
  
  // Summary section
  A8: { value: "Department Summary:" },
  A9: { value: "Total Employees:" },
  B9: { value: 5, formula: "=COUNT(A2:A6)" },
  A10: { value: "Average Salary:" },
  B10: { value: 7640, formula: "=AVERAGE(E2:E6)" },
  A11: { value: "Total Compensation:" },
  B11: { value: 42964, formula: "=SUM(G2:G6)" },
  
  // Performance metrics
  D9: { value: "Top Performer:" },
  E9: { value: "Lisa Chen" },
  D10: { value: "Highest Bonus:" },
  E10: { value: "18%" },
  D11: { value: "Department Count:" },
  E11: { value: 4, formula: "=COUNT(C2:C6)" },
  
  // Additional data for testing features
  H1: { value: "Copy/Paste Demo" },
  H2: { value: "Quarter" },
  I2: { value: "Target" },
  J2: { value: "Actual" },
  H3: { value: "Q1" },
  I3: { value: 25000 },
  J3: { value: 27500 },
  H4: { value: "Q2" },
  I4: { value: 28000 },
  J4: { value: 26800 },
  
  // Sorting demo data
  L1: { value: "Sort Demo (Random)" },
  L2: { value: 156 },
  L3: { value: 89 },
  L4: { value: 234 },
  L5: { value: 45 },
  L6: { value: 178 },
  L7: { value: 123 },
  
  // Instructions and examples
  A13: { value: "Feature Testing:" },
  A14: { value: "• Double-click cells to edit" },
  A15: { value: "• Try formulas: =SUM(E2:E6)" },
  A16: { value: "• Copy H2:J4 and paste elsewhere" },
  A17: { value: "• Sort column L (ascending/descending)" },
  A18: { value: "• Right-click cells for comments" },
  A19: { value: "• Use Ctrl+Z/Y for undo/redo" },
  
  // Chart data section
  N1: { value: "Chart Data Sample" },
  N2: { value: "Product" },
  O2: { value: "Sales" },
  P2: { value: "Profit" },
  N3: { value: "Laptops" },
  O3: { value: 45000 },
  P3: { value: 12000 },
  N4: { value: "Phones" },
  O4: { value: 38000 },
  P4: { value: 15000 },
  N5: { value: "Tablets" },
  O5: { value: 22000 },
  P5: { value: 8000 },
  N6: { value: "Accessories" },
  O6: { value: 15000 },
  P6: { value: 7500 },
  
  // Navigation test data
  A25: { value: "Scroll Test - More data below" },
  A50: { value: "Middle section - Press Ctrl+Home to go to A1" },
  A100: { value: "Far down - Use Page Up/Down for navigation" },
  
  // Horizontal scroll test
  Z1: { value: "Far Right" },
  Z2: { value: "Horizontal scroll test" },
  AA1: { value: "Column AA" },
  AB1: { value: "Column AB" },
};

export const demoSheets = [
  {
    id: "sheet1",
    name: "Products",
    cells: demoCells,
  },
  {
    id: "sheet2", 
    name: "Quarterly Data",
    cells: {
      A1: { value: "Quarter" },
      B1: { value: "Revenue" },
      C1: { value: "Expenses" },
      D1: { value: "Profit" },
      A2: { value: "Q1 2024" },
      B2: { value: 125000 },
      C2: { value: 85000 },
      D2: { value: "=B2-C2", formula: "=B2-C2" },
      A3: { value: "Q2 2024" },
      B3: { value: 142000 },
      C3: { value: 92000 },
      D3: { value: "=B3-C3", formula: "=B3-C3" },
    }
  }
];
