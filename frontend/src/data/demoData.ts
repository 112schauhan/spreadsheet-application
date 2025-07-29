import { type CellData } from "../types/grid.types";

export const demoCells: Record<string, CellData> = {
  // Prefill some data for demo and testing
  A1: { value: "Item" },
  B1: { value: "Quantity" },
  C1: { value: "Price" },
  D1: { value: "Total" },
  A2: { value: "Apple" },
  B2: { value: 10 },
  C2: { value: 3.15 },
  D2: { value: "=B2*C2", formula: "=B2*C2" },
  A3: { value: "Banana" },
  B3: { value: 5 },
  C3: { value: 2.45 },
  D3: { value: "=B3*C3", formula: "=B3*C3" },
  A4: { value: "Orange" },
  B4: { value: 12 },
  C4: { value: 4.20 },
  D4: { value: "=B4*C4", formula: "=B4*C4" },
  A5: { value: "Total" },
  B5: { value: "=SUM(B2:B4)", formula: "=SUM(B2:B4)" },
  C5: { value: "=SUM(C2:C4)", formula: "=SUM(C2:C4)" },
  D5: { value: "=SUM(D2:D4)", formula: "=SUM(D2:D4)" },
  
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
  
  // Add some data to the right to demo horizontal scrolling
  Z1: { value: "Notes" },
  Z2: { value: "Fresh fruit" },
  Z3: { value: "Organic" },
  Z4: { value: "Import" },
  
  // Add data even further right
  AC1: { value: "Status" },
  AC2: { value: "Available" },
  AC3: { value: "Limited" },
  AC4: { value: "In Stock" },
  
  // Add data further down
  A50: { value: "Year End Summary" },
  A100: { value: "Archive Data" },
  A200: { value: "Historical Records" },
  A500: { value: "Deep Archive" },
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
