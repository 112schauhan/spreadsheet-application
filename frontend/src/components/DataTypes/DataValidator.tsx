import React, { useEffect, useState } from "react"
import { validateCellValue } from "../../services/validationService"

interface DataValidatorProps {
  value: string
  dataType: "number" | "date" | "string"
  onValidChange?: (isValid: boolean) => void
  children: React.ReactNode
}

const DataValidator: React.FC<DataValidatorProps> = ({
  value,
  dataType,
  onValidChange,
  children,
}) => {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (value === "") {
      setError(null)
      if (onValidChange) {
        onValidChange(true)
      }
      return
    }

    // Map "string" to "text" for validationService compatibility
    const mappedType = dataType === "string" ? "text" : dataType
    const validation = validateCellValue(value, mappedType)
    setError(validation.error || null)
    
    if (onValidChange) {
      onValidChange(validation.isValid)
    }
  }, [value, dataType, onValidChange])

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && typeof child.type !== "string"
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            React.cloneElement(child, { error } as any)
          : child
      )}
      {error && (
        <p className="mt-1 text-red-600 text-sm select-none">{error}</p>
      )}
    </div>
  )
}

export default DataValidator
