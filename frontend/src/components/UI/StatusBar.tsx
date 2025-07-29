import React from "react"
import { useSelector } from "react-redux"
import { type RootState } from "../../store"
import GridScrollStatus from "../Grid/GridScrollStatus"

const StatusBar: React.FC = () => {
  const selection = useSelector((state: RootState) => state.selection)

  return (
    <footer className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-300 text-sm">
      <div className="flex items-center space-x-4">
        <span>
          Selected:{" "}
          {selection.selectedRange?.start && selection.selectedRange?.end
            ? `${selection.selectedRange.start} to ${selection.selectedRange.end}`
            : selection.selectedCell || "None"}
        </span>
      </div>
      
      <GridScrollStatus />
    </footer>
  )
}

export default StatusBar
