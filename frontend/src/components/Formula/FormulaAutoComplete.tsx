import React, { useState, useEffect } from "react"

const FORMULA_FUNCTIONS = [
  "SUM",
  "AVERAGE",
  "COUNT",
  "MIN",
  "MAX",
  "IF",
  "AND",
  "OR",
]

interface FormulaAutocompleteProps {
  input: string
  onSelect: (fnName: string) => void
  visible: boolean
  position: { top: number; left: number }
}

const FormulaAutocomplete: React.FC<FormulaAutocompleteProps> = ({
  input,
  onSelect,
  visible,
  position,
}) => {
  const [filtered, setFiltered] = useState<string[]>([])
  const [highlightIndex, setHighlightIndex] = useState(0)

  useEffect(() => {
    if (!input.startsWith("=")) {
      setFiltered([])
      return
    }
    const prefix = input.slice(1).toUpperCase()
    if (prefix.length === 0) {
      setFiltered(FORMULA_FUNCTIONS)
    } else {
      setFiltered(
        FORMULA_FUNCTIONS.filter((fn) => fn.startsWith(prefix)).slice(0, 5)
      )
    }
    setHighlightIndex(0)
  }, [input])

  const selectItem = (fnName: string) => {
    onSelect(fnName + "()")
  }

  if (!visible || filtered.length === 0) return null

  return (
    <ul
      className="absolute z-50 w-48 max-h-48 overflow-auto rounded border border-gray-300 bg-white shadow-lg"
      style={{ top: position.top, left: position.left }}
      role="listbox"
      tabIndex={-1}
    >
      {filtered.map((fn, idx) => (
        <li
          key={fn}
          className={`px-3 py-1 cursor-pointer select-none ${
            idx === highlightIndex
              ? "bg-blue-600 text-white"
              : "text-gray-900 hover:bg-blue-100"
          }`}
          onMouseDown={(e) => {
            e.preventDefault()
            selectItem(fn)
          }}
          role="option"
          aria-selected={idx === highlightIndex}
        >
          {fn}
        </li>
      ))}
    </ul>
  )
}

export default FormulaAutocomplete
