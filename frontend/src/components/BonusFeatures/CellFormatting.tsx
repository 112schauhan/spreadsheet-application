// frontend/src/components/BonusFeatures/CellFormatting.tsx
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../../store"
import { setCellFormatting } from "../../store/formattingSlice"

const CellFormatting: React.FC = () => {
  const dispatch = useDispatch()
  const selection = useSelector((state: RootState) => state.selection)
  const formats = useSelector(
    (state: RootState) => state.formatting.formats
  )

  if (!selection.selectedCell) return null

  // Get formatting for currently selected cell (simplified for single cell)
  const format = formats[selection.selectedCell] || {}

  const toggleFormat = (key: string) => {
    dispatch(
      setCellFormatting({
        cellRef: selection.selectedCell!,
        formatting: {
          ...format,
          [key]: !format[key as keyof typeof format],
        },
      })
    )
  }

  return (
    <div className="flex gap-2 p-2 bg-gray-50 border border-gray-200 rounded shadow select-none">
      <button
        onClick={() => toggleFormat("bold")}
        className={`px-2 py-1 font-bold border rounded ${
          format.bold ? "bg-blue-600 text-white" : "bg-white text-gray-700"
        }`}
        aria-pressed={!!format.bold}
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => toggleFormat("italic")}
        className={`px-2 py-1 italic border rounded ${
          format.italic ? "bg-blue-600 text-white" : "bg-white text-gray-700"
        }`}
        aria-pressed={!!format.italic}
        title="Italic"
      >
        I
      </button>
      {/* Color buttons example */}
      <button
        onClick={() => toggleFormat("textColor")}
        style={{ color: format.textColor || "inherit" }}
        className="px-2 py-1 border rounded"
        title="Text Color"
      >
        A
      </button>
      <button
        onClick={() => toggleFormat("bgColor")}
        style={{ backgroundColor: format.bgColor || "transparent" }}
        className="px-2 py-1 border rounded"
        title="Cell Background Color"
      >
        ▮
      </button>
    </div>
  )
}

export default CellFormatting
