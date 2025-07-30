import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../store"
import { updateCell } from "../../store/gridSlice"
import { cellsToTSV, tsvToCells } from "../../utils/clipboardUtils"
import { getCellsInRange } from "../../utils/selectionUtils"

const CopyPasteHandler: React.FC = () => {
  const dispatch = useDispatch()
  const selection = useSelector((state: RootState) => state.selection)
  const cells = useSelector((state: RootState) => state.grid.cells)

  React.useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      let cellRefs: string[] = [];
      
      // Handle different selection types
      if (selection.selectedRange) {
        cellRefs = getCellsInRange(selection.selectedRange);
      } else if (selection.selectedCells.length > 0) {
        cellRefs = selection.selectedCells;
      } else if (selection.selectedCell) {
        cellRefs = [selection.selectedCell];
      }
      
      if (cellRefs.length > 0) {
        const tsv = cellsToTSV(cellRefs, cells)
        e.clipboardData?.setData("text/plain", tsv)
        e.preventDefault()
      }
    }

    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text/plain")
      if (text && selection.selectedCell) {
        const updates = tsvToCells(text, selection.selectedCell)
        Object.entries(updates).forEach(([cellRef, cellObj]) => {
          dispatch(updateCell({ cellRef, value: cellObj.value }))
        })
        e.preventDefault()
      }
    }

    document.addEventListener("copy", handleCopy)
    document.addEventListener("paste", handlePaste)
    return () => {
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("paste", handlePaste)
    }
  }, [dispatch, selection, cells])

  return null // no UI: event listeners only
}

export default CopyPasteHandler
