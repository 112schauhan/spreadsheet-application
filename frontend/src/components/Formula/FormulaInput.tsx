import React, { forwardRef } from "react"

interface FormulaInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null
}

const FormulaInput = forwardRef<HTMLInputElement, FormulaInputProps>(
  ({ error, className = "", ...props }, ref) => (
    <>
      <input
        ref={ref}
        className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-red-600 text-sm">{error}</p>}
    </>
  )
)

FormulaInput.displayName = "FormulaInput"

export default FormulaInput
