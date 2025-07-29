import React, { useEffect, useState } from "react"

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
    let valid = true
    let message = null

    if (dataType === "number") {
      if (value !== "" && isNaN(Number(value))) {
        valid = false
        message = "Value must be a valid number"
      }
    } else if (dataType === "date") {
      if (value !== "" && isNaN(Date.parse(value))) {
        valid = false
        message = "Value must be a valid date"
      }
    }
    // For strings, no strict validation here

    setError(message)
    if (onValidChange) {
      onValidChange(valid)
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
