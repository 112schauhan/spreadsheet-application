import { useState } from "react"
import {
  validateCellValue,
  validateFormula,
} from "../services/validationService"

const useDataValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const validateInput = (
    cellRef: string,
    value: string,
    type: "text" | "number" | "date" | "formula"
  ) => {
    const result =
      type === "formula"
        ? validateFormula(value)
        : validateCellValue(value, type)
    if (!result.isValid && result.error)
      setErrors((prev) => ({ ...prev, [cellRef]: result.error! }))
    else
      setErrors((prev) => {
        const n = { ...prev }
        delete n[cellRef]
        return n
      })
    return result.isValid
  }
  return { errors, validateInput }
}
export default useDataValidation
