// frontend/src/components/Operations/CellRangeSelector.tsx
import React from "react"
import { useSelector } from "react-redux"
import { type RootState } from "../../store"
import { parseCellRef, colToIndex } from "../../utils/cellUtils"
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  COLUMN_HEADER_HEIGHT,
  ROW_HEADER_WIDTH,
} from "../../config/constants"
/**
 * Visually highlights the selected cell range as a rectangle overlay.
 */
const CellRangeSelector: React.FC = () => {
  const selection = useSelector((state: RootState) => state.selection)

  if (!selection.selectedRange?.start || !selection.selectedRange?.end)
    return null
  const { col: startColLetter, row: startRow } = parseCellRef(
    selection.selectedRange.start
  )
  const { col: endColLetter, row: endRow } = parseCellRef(
    selection.selectedRange.end
  )

  const startCol = colToIndex(startColLetter)
  const endCol = colToIndex(endColLetter)

  const leftCol = Math.min(startCol, endCol)
  const rightCol = Math.max(startCol, endCol)
  const topRow = Math.min(startRow, endRow)
  const bottomRow = Math.max(startRow, endRow)

  // Calculate pixel positions relative to grid container
  const left = ROW_HEADER_WIDTH + leftCol * CELL_WIDTH
  const top = COLUMN_HEADER_HEIGHT + (topRow - 1) * CELL_HEIGHT
  const width = (rightCol - leftCol + 1) * CELL_WIDTH
  const height = (bottomRow - topRow + 1) * CELL_HEIGHT

  return (
    <div
      aria-label="Selected cell range"
      role="region"
      className="pointer-events-none absolute border-2 border-blue-500 rounded bg-blue-400 bg-opacity-20 transition-all"
      style={{
        top,
        left,
        width,
        height,
        zIndex: 40,
      }}
    />
  )
}

export default CellRangeSelector
