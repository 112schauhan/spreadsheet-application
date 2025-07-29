import React from "react"

const FUNCTION_HELP = [
  {
    name: "SUM",
    description: "Adds all numbers in a range of cells.",
    syntax: "=SUM(A1:A10)",
  },
  {
    name: "AVERAGE",
    description: "Calculates the average of numbers in a range.",
    syntax: "=AVERAGE(B1:B10)",
  },
  {
    name: "COUNT",
    description: "Counts the number of non-empty cells.",
    syntax: "=COUNT(A1:A10)",
  },
  {
    name: "IF",
    description: "Returns one value if condition is true, else another.",
    syntax: '=IF(A1>5, "Yes", "No")',
  },
  // Add more function helps as needed...
]

interface FunctionHelpProps {
  visible: boolean
  onClose: () => void
}

const FunctionHelp: React.FC<FunctionHelpProps> = ({ visible, onClose }) => {
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="function-help-title"
    >
      <div
        className="bg-white p-6 max-w-lg w-full max-h-96 overflow-auto rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="function-help-title"
          className="text-xl font-bold mb-4 text-blue-700"
        >
          Formula Function Help
        </h2>
        <ul className="space-y-4">
          {FUNCTION_HELP.map(({ name, description, syntax }) => (
            <li key={name}>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-gray-700">{description}</p>
              <code className="block mt-1 bg-gray-100 p-2 rounded font-mono text-sm">
                {syntax}
              </code>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default FunctionHelp
