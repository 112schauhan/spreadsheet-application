import React from "react"
import { useSelector } from "react-redux"
import { undo, redo } from "../../store/historySlice"
import { type RootState, useAppDispatch } from "../../store"

const UndoRedo: React.FC = () => {
  const dispatch = useAppDispatch()
  const undoStackLength = useSelector(
    (state: RootState) => state.history.past.length
  )
  const redoStackLength = useSelector(
    (state: RootState) => state.history.future.length
  )

  return (
    <div className="flex gap-2">
      <button
        onClick={() => dispatch(undo())}
        disabled={undoStackLength === 0}
        className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Undo
      </button>
      <button
        onClick={() => dispatch(redo())}
        disabled={redoStackLength === 0}
        className={`px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Redo
      </button>
    </div>
  )
}

export default UndoRedo
