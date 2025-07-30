import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { type RootState, useAppDispatch } from "../../store"
import { setFormula, setFormulaError } from "../../store/formulaSlice"
import { updateCellWithHistory } from "../../store/gridSlice"
import { setLoading, setNotification } from "../../store/uiSlice"
import { isFormula, validateFormulaInput } from "../../utils/formulaUtils"
import useFormulaEngine from "../../hooks/useFormulaEngine"

const FormulaBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const selection = useSelector((state: RootState) => state.selection)
  const formulaState = useSelector((state: RootState) => state.formula)
  const cells = useSelector((state: RootState) => state.grid.cells)
  const { evaluate } = useFormulaEngine()

  const [input, setInput] = useState("")

  useEffect(() => {
    // Get the currently selected cell reference
    const currentCellRef = selection.selectedCell || selection.selectedRange?.start;
    
    if (!currentCellRef) {
      setInput("")
      return
    }

    const cellData = cells[currentCellRef]
    // If the cell has a formula, show the formula in the formula bar
    // If it's just a value, show the value
    if (cellData?.formula) {
      setInput(cellData.formula)
    } else {
      setInput(cellData?.value?.toString() ?? "")
    }
  }, [selection, cells])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    
    // Only validate and dispatch for formulas
    if (e.target.value.startsWith("=")) {
      if (!validateFormulaInput(e.target.value)) {
        dispatch(setFormulaError("Invalid formula syntax. Use format like =SUM(A1:A10)"))
      } else {
        // Additional validation: check if the range format is valid
        const formulaUpper = e.target.value.toUpperCase()
        if (formulaUpper.startsWith("=SUM(") || formulaUpper.startsWith("=AVERAGE(") || formulaUpper.startsWith("=COUNT(")) {
          const match = e.target.value.match(/^=\w+\(([^)]+)\)$/i)
          if (match) {
            const rangeArg = match[1]
            // Basic validation of range format
            if (rangeArg.includes(':')) {
              if (!/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(rangeArg.trim())) {
                dispatch(setFormulaError("Invalid range format. Use format like A1:A10"))
              } else {
                dispatch(setFormulaError(null))
              }
            } else {
              if (!/^[A-Z]+[0-9]+$/.test(rangeArg.trim())) {
                dispatch(setFormulaError("Invalid cell reference. Use format like A1"))
              } else {
                dispatch(setFormulaError(null))
              }
            }
          }
        } else {
          dispatch(setFormulaError(null))
        }
      }
      dispatch(setFormula(e.target.value))
    } else {
      // Clear errors for non-formula inputs
      dispatch(setFormulaError(null))
    }
  }

  const onSubmit = async () => {
    console.log("=== FORMULA SUBMISSION START ===")
    console.log("Submitting formula:", input)
    
    // Get the currently selected cell reference
    const currentCellRef = selection.selectedCell || selection.selectedRange?.start;
    
    if (!currentCellRef) {
      console.log("No cell selected")
      const errorMsg = "No cell selected"
      console.log("Dispatching error notification:", errorMsg)
      dispatch(setNotification({ type: "error", message: errorMsg }))
      return
    }
    
    console.log("Selected cell:", currentCellRef)
    
    // Show loading for complex operations
    dispatch(setLoading(true))
    
    try {
      let valueToSave: string | number = input
      let formula: string | undefined = undefined

      if (isFormula(input)) {
        console.log("Processing formula:", input)
        console.log("Validating formula input...")
        const isValid = validateFormulaInput(input)
        console.log("Formula validation result:", isValid)
        
        if (!isValid) {
          console.log("Formula validation failed")
          const errorMsg = "Invalid formula syntax. Please check your formula format."
          console.log("Dispatching validation error notification:", errorMsg)
          dispatch(setFormulaError(errorMsg))
          dispatch(setNotification({ type: "error", message: errorMsg }))
          dispatch(setLoading(false)) // Ensure loading is turned off
          return
        }
        formula = input
        console.log("Evaluating formula...")
        // Evaluate the formula and use the result as the display value
        const evaluatedResult = evaluate(input)
        console.log("Formula evaluation result:", evaluatedResult)
        if (evaluatedResult === "#ERROR") {
          const errorMsg = "Formula evaluation error. Please check your cell references and formula syntax."
          console.log("Dispatching evaluation error notification:", errorMsg)
          dispatch(setFormulaError(errorMsg))
          dispatch(setNotification({ type: "error", message: errorMsg }))
          dispatch(setLoading(false)) // Ensure loading is turned off
          return
        }
        valueToSave = evaluatedResult
      } else if (input.match(/^(SUM|AVERAGE|COUNT)\(/i)) {
        // Handle common case where user forgets the = sign
        console.log("Detected formula without = sign, auto-correcting:", input)
        const correctedFormula = "=" + input
        if (!validateFormulaInput(correctedFormula)) {
          const errorMsg = "Invalid formula syntax. Please check your formula format."
          dispatch(setFormulaError(errorMsg))
          dispatch(setNotification({ type: "error", message: errorMsg }))
          dispatch(setLoading(false)) // Ensure loading is turned off
          return
        }
        formula = correctedFormula
        console.log("Evaluating auto-corrected formula:", correctedFormula)
        const evaluatedResult = evaluate(correctedFormula)
        console.log("Formula evaluation result:", evaluatedResult)
        if (evaluatedResult === "#ERROR") {
          const errorMsg = "Formula evaluation error. Please check your cell references and formula syntax."
          dispatch(setFormulaError(errorMsg))
          dispatch(setNotification({ type: "error", message: errorMsg }))
          dispatch(setLoading(false)) // Ensure loading is turned off
          return
        }
        valueToSave = evaluatedResult
        // Show success message for auto-correction
        dispatch(setNotification({ type: "success", message: `Auto-corrected formula to ${correctedFormula}` }))
      } else {
        console.log("Processing as regular value:", input)
        // Try to convert to number if it's numeric
        const numericValue = parseFloat(input);
        if (!isNaN(numericValue) && input.trim() !== "") {
          valueToSave = numericValue;
          console.log("Converted to number:", numericValue);
        } else {
          valueToSave = input;
          console.log("Keeping as string:", input);
        }
      }

      console.log("About to dispatch updateCell with:", {
        cellRef: currentCellRef,
        value: valueToSave,
        formula
      })
      
      dispatch(
        updateCellWithHistory({ 
          cellRef: currentCellRef, 
          value: valueToSave, 
          formula 
        })
      )
      dispatch(setFormulaError(null))
      console.log("Formula applied to cell:", currentCellRef, "with value:", valueToSave)
      
      // Show success notification for formulas
      if (formula) {
        const successMsg = `Formula ${formula} applied successfully`
        console.log("Dispatching success notification:", successMsg)
        dispatch(setNotification({ type: "success", message: successMsg }))
      }
      
      // Verify the cell was updated by checking the state after a short delay
      setTimeout(() => {
        console.log("Grid state after update (delayed check):", cells[currentCellRef])
      }, 100);
    } catch (error) {
      console.error("Unexpected error in onSubmit:", error)
      const errorMsg = "An unexpected error occurred while processing the formula"
      console.log("Dispatching unexpected error notification:", errorMsg)
      dispatch(setNotification({ type: "error", message: errorMsg }))
    } finally {
      // Always hide loading, even if there's an error
      dispatch(setLoading(false))
      console.log("=== FORMULA SUBMISSION END ===")
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit()
    }
  }

  return (
    <div className="flex items-center border-b border-gray-300 bg-gray-50 px-4 py-2">
      <label htmlFor="formula" className="mr-2 font-semibold">
        fx
      </label>
      <input
        id="formula"
        type="text"
        className={`flex-1 px-3 py-1 rounded border ${
          formulaState.errors ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-text`}
        placeholder="Enter formula or value"
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        aria-invalid={!!formulaState.errors}
        aria-describedby="formula-error"
      />
      {formulaState.errors && (
        <div className="ml-3 flex items-center">
          <span
            id="formula-error"
            className="text-red-600 text-sm select-none bg-red-50 px-2 py-1 rounded border border-red-200"
          >
            ⚠️ {formulaState.errors}
          </span>
        </div>
      )}
      <button
        onClick={onSubmit}
        className="ml-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        aria-label="Apply formula"
      >
        Apply
      </button>
    </div>
  )
}

export default FormulaBar
