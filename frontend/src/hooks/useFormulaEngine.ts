import { useCallback } from "react"
import { useSelector } from "react-redux"
import { type RootState } from "../store"

// Move getRangeCells outside the hook to prevent recreation
function getRangeCells(range: string): string[] {
  // Handle single cell reference (e.g., "C2")
  if (!range.includes(':')) {
    return [range.trim()];
  }
  
  // Handle range reference (e.g., "C2:C4")
  const m = range.match(/^([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)$/)
  if (!m) {
    console.warn("Invalid range format:", range);
    return [];
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startCol, startRow, endCol, endRow] = m
  const sC = startCol.charCodeAt(0),
    eC = endCol.charCodeAt(0)
  const sR = +startRow,
    eR = +endRow
  const refs: string[] = []
  for (let c = sC; c <= eC; c++)
    for (let r = sR; r <= eR; r++) refs.push(String.fromCharCode(c) + r)
  return refs
}

const useFormulaEngine = () => {
  const cells = useSelector((state: RootState) => state.grid.cells)
  const evaluate = useCallback(
    (formula: string): string | number => {
      console.log("Formula engine evaluating:", formula);
      try {
        const f = formula.toUpperCase()
        if (f.startsWith("=SUM(") && f.endsWith(")")) {
          const arg = f.substring(5, f.length - 1)
          console.log("SUM argument:", arg);
          const refs = getRangeCells(arg)
          console.log("SUM cell references:", refs);
          const result = refs.reduce((total, ref) => {
            const c = cells[ref]
            const value = c && typeof c.value === "number" ? c.value : 0;
            console.log(`Cell ${ref}:`, c, "-> value:", value);
            return total + value;
          }, 0)
          console.log("SUM result:", result);
          return result;
        }
        if (f.startsWith("=AVERAGE(") && f.endsWith(")")) {
          const arg = f.substring(9, f.length - 1)
          console.log("AVERAGE argument:", arg);
          const refs = getRangeCells(arg)
          console.log("AVERAGE cell references:", refs);
          let sum = 0,
            count = 0
          refs.forEach((ref) => {
            const c = cells[ref]
            if (c && typeof c.value === "number") {
              sum += c.value
              count++
              console.log(`Cell ${ref}: ${c.value} (included)`);
            } else {
              console.log(`Cell ${ref}:`, c, "(excluded - not a number)");
            }
          })
          const result = count === 0 ? 0 : sum / count;
          console.log("AVERAGE result:", result);
          return result;
        }
        if (f.startsWith("=COUNT(") && f.endsWith(")")) {
          const arg = f.substring(7, f.length - 1)
          console.log("COUNT argument:", arg);
          const refs = getRangeCells(arg)
          console.log("COUNT cell references:", refs);
          const result = refs.filter(
            (ref) => {
              const cell = cells[ref];
              const hasValue = cell && cell.value != null && cell.value !== "";
              console.log(`Cell ${ref}:`, cell, "-> counted:", hasValue);
              return hasValue;
            }
          ).length;
          console.log("COUNT result:", result);
          return result;
        }
        console.log("Unsupported formula:", formula);
        return "#ERROR"
      } catch (error) {
        console.error("Formula evaluation error:", error);
        return "#ERROR"
      }
    },
    [cells]
  )

  return { evaluate }
}
export default useFormulaEngine
