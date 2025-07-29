import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../store"
import { updateCell } from "../../store/gridSlice"
import { cellsToTSV, tsvToCells } from "../../utils/clipboardUtils"

const CopyPasteHandler: React.FC = () => {
  const dispatch = useDispatch()
  const selection = useSelector((state: RootState) => state.selection)
  const cells = useSelector((state: RootState) => state.grid.cells)

  React.useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (selection.selectedRange?.start && selection.selectedRange?.end) {
        const refs = [
          selection.selectedRange.start,
          selection.selectedRange.end,
        ]
        const tsv = cellsToTSV(refs, cells)
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
