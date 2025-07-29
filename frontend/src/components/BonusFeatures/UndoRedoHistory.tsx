import React from "react"
import { useSelector } from "react-redux"
import { type RootState } from "../../store"

const UndoRedoHistory: React.FC = () => {
  const undoStack = useSelector((state: RootState) => state.history.past)
  const redoStack = useSelector((state: RootState) => state.history.future)

  return (
    <div className="p-3 max-h-64 overflow-auto bg-gray-50 border border-gray-300 rounded shadow text-sm w-72">
      <h3 className="font-semibold mb-2">Undo History</h3>
      {undoStack.length === 0 ? (
        <p className="text-gray-400">No undo history</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {undoStack.map((action, index) => (
            <li key={index}>{JSON.stringify(action)}</li>
          ))}
        </ul>
      )}
      <h3 className="font-semibold mt-4 mb-2">Redo History</h3>
      {redoStack.length === 0 ? (
        <p className="text-gray-400">No redo history</p>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {redoStack.map((action, index) => (
            <li key={index}>{JSON.stringify(action)}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UndoRedoHistory
