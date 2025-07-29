import React from "react"
import { validateFormulaInput } from "../../utils/formulaUtils"

interface FormulaValidatorProps {
  formula: string
  onValidChange?: (valid: boolean) => void
}

const FormulaValidator: React.FC<FormulaValidatorProps> = ({
  formula,
  onValidChange,
}) => {
  const isValid = validateFormulaInput(formula)

  React.useEffect(() => {
    if (onValidChange) {
      onValidChange(isValid)
    }
  }, [isValid, onValidChange])

  if (!formula.startsWith("=")) return null

  return (
    <div
      className={`mt-1 text-sm ${
        isValid ? "text-green-600" : "text-red-600"
      } font-medium select-none`}
      role="alert"
      aria-live="polite"
    >
      {isValid ? "Valid formula" : "Invalid formula syntax"}
    </div>
  )
}

export default FormulaValidator
