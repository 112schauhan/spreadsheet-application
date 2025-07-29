import React from "react"

interface Sheet {
  id: string
  name: string
}

interface MultipleSheetsProps {
  sheets: Sheet[]
  activeSheetId: string
  onChangeSheet: (sheetId: string) => void
  onAddSheet?: () => void
  onDeleteSheet?: (sheetId: string) => void
}

const MultipleSheets: React.FC<MultipleSheetsProps> = ({
  sheets,
  activeSheetId,
  onChangeSheet,
  onAddSheet,
  onDeleteSheet,
}) => {
  return (
    <div className="flex items-center space-x-1 bg-gray-100 border-b border-gray-300 px-4 py-2 overflow-x-auto">
      {sheets.map(({ id, name }) => (
        <button
          key={id}
          className={`px-4 py-1 rounded-t border-b-2 focus:outline-none ${
            id === activeSheetId
              ? "border-blue-600 font-semibold text-blue-600"
              : "border-transparent hover:border-gray-400 text-gray-600"
          }`}
          onClick={() => onChangeSheet(id)}
        >
          {name}
          {onDeleteSheet && (
            <span
              className="ml-2 cursor-pointer text-gray-400 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteSheet(id)
              }}
              aria-label={`Delete sheet ${name}`}
              role="button"
            >
              ×
            </span>
          )}
        </button>
      ))}
      {onAddSheet && (
        <button
          onClick={onAddSheet}
          className="ml-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
          aria-label="Add new sheet"
        >
          +
        </button>
      )}
    </div>
  )
}

export default MultipleSheets
