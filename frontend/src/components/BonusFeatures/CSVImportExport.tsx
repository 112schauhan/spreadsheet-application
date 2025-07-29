import React, { useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { type RootState } from "../../store"
import { gridTo2DArray } from "../../utils/csvUtils"
import { updateCell } from "../../store/gridSlice"
import { setLoading, setNotification } from "../../store/uiSlice"

const CSVImportExport: React.FC = () => {
  const dispatch = useDispatch()
  const grid = useSelector((state: RootState) => state.grid)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Export current grid to CSV string and download
  const onExport = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setNotification({ type: "success", message: "Preparing CSV export..." }));
      
      const arr = gridTo2DArray(grid.cells, grid.rows, grid.columns)
      const csvContent =
        "data:text/csv;charset=utf-8," +
        arr
          .map((row) =>
            row
              .map((cell) => `"${cell?.toString().replace(/"/g, '""') || ""}"`)
              .join(",")
          )
          .join("\n")
      const encodedUri = encodeURI(csvContent)

      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "spreadsheet.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      dispatch(setNotification({ type: "success", message: "CSV exported successfully!" }));
    } catch (error) {
      dispatch(setNotification({ type: "error", message: "Failed to export CSV" }));
      console.error("Export error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  // Handle CSV file upload & parse
  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      dispatch(setLoading(true));
      dispatch(setNotification({ type: "success", message: "Importing CSV..." }));

      const reader = new FileReader()
      reader.onload = (ev) => {
        if (typeof ev.target?.result !== "string") return

        try {
          // Parse CSV (simple implementation)
          const rows = ev.target.result.split("\n")
          rows.forEach((row, rowIndex) => {
            const cells = row.split(",")
            cells.forEach((cell, colIndex) => {
              // Remove quotes
              const val = cell.trim().replace(/^"|"$/g, "")
              const colLetter = String.fromCharCode(65 + colIndex)
              const cellRef = `${colLetter}${rowIndex + 1}`
              dispatch(updateCell({ cellRef, value: val }))
            })
          })
          
          dispatch(setNotification({ type: "success", message: "CSV imported successfully!" }));
        } catch (parseError) {
          dispatch(setNotification({ type: "error", message: "Failed to parse CSV file" }));
          console.error("Parse error:", parseError);
        } finally {
          dispatch(setLoading(false));
        }
      }
      
      reader.onerror = () => {
        dispatch(setNotification({ type: "error", message: "Failed to read CSV file" }));
        dispatch(setLoading(false));
      };
      
      reader.readAsText(file)
    } catch (error) {
      dispatch(setNotification({ type: "error", message: "Failed to import CSV" }));
      dispatch(setLoading(false));
      console.error("Import error:", error);
    }
    
    // Clear input for re-upload of same file
    e.target.value = ""
  }

  return (
    <div className="flex gap-3 items-center bg-gray-50 px-3 py-2 border border-gray-300 rounded">
      <button
        onClick={onExport}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Export CSV
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Import CSV
      </button>
      <input
        ref={fileInputRef}
        onChange={onImport}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
      />
    </div>
  )
}

export default CSVImportExport
