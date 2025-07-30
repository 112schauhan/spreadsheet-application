import { type CellData } from "../types/grid.types";

export const demoCells: Record<string, CellData> = {
  // Demo for all required features
  
  // 1. Basic data for formulas and sorting
  A1: { value: "Product" },
  B1: { value: "Price" },
  C1: { value: "Quantity" },
  D1: { value: "Total" },
  E1: { value: "Category" },
  
  A2: { value: "Apple" },
  B2: { value: 3.15 },
  C2: { value: 10 },
  D2: { value: 31.5, formula: "=B2*C2" },
  E2: { value: "Fruit" },
  
  A3: { value: "Banana" },
  B3: { value: 2.45 },
  C3: { value: 5 },
  D3: { value: 12.25, formula: "=B3*C3" },
  E3: { value: "Fruit" },
  
  A4: { value: "Orange" },
  B4: { value: 4.20 },
  C4: { value: 12 },
  D4: { value: 50.4, formula: "=B4*C4" },
  E4: { value: "Fruit" },
  
  A5: { value: "Carrot" },
  B5: { value: 1.85 },
  C5: { value: 8 },
  D5: { value: 14.8, formula: "=B5*C5" },
  E5: { value: "Vegetable" },
  
  // 2. Formula examples showcase
  A7: { value: "Formula Examples:" },
  A8: { value: "SUM:" },
  B8: { value: 108.8, formula: "=SUM(D2:D5)" },
  A9: { value: "AVERAGE:" },
  B9: { value: 27.2, formula: "=AVERAGE(D2:D5)" },
  A10: { value: "COUNT:" },
  B10: { value: 4, formula: "=COUNT(D2:D5)" },
  
  // 3. Demo data for copy/paste testing
  G1: { value: "Copy/Paste Demo" },
  G2: { value: "Value 1" },
  H2: { value: 100 },
  G3: { value: "Value 2" },
  H3: { value: 200 },
  G4: { value: "Value 3" },
  H4: { value: 300 },
  
  // 4. Sorting demo data (unsorted numbers)
  J1: { value: "Sort Demo" },
  J2: { value: 45 },
  J3: { value: 12 },
  J4: { value: 78 },
  J5: { value: 23 },
  J6: { value: 67 },
  
  // 5. Cell editing examples
  A12: { value: "Double-click to edit" },
  A13: { value: "Press F2 to edit" },
  A14: { value: "Press Enter to edit" },
  
  // 6. Row/Column operations demo
  A16: { value: "Operations Demo" },
  B16: { value: "Add/Delete rows/cols" },
  C16: { value: "Use sidebar controls" },
  
  // Add some data further down to demo scrolling
  A20: { value: "Quarterly Report" },
  B20: { value: "Q1" },
  C20: { value: "Q2" },
  D20: { value: "Q3" },
  E20: { value: "Q4" },
  A21: { value: "Sales" },
  B21: { value: 15000 },
  C21: { value: 18000 },
  D21: { value: 22000 },
  E21: { value: 19000 },
  A22: { value: "Total" },
  B22: { value: 74000, formula: "=SUM(B21:E21)" },
  
  // Add some data to the right to demo horizontal scrolling
  Z1: { value: "Notes" },
  Z2: { value: "Fresh fruit" },
  Z3: { value: "Organic" },
  Z4: { value: "Import" },
  
  // Add navigation test data
  A50: { value: "Navigation Test" },
  A100: { value: "Press Ctrl+Home to go to A1" },
  A200: { value: "Use Page Up/Down" },
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
