import React from "react"
import { useAppDispatch } from "../../store"
import { undo, redo } from "../../store/historySlice"
import CommentsButton from "../Comments/CommentsButton"

const Toolbar: React.FC = () => {
  const dispatch = useAppDispatch()

  return (
    <header className="flex items-center gap-2 bg-gray-100 border-b border-gray-200 px-4 py-2 shadow">
      <h1 className="text-lg font-bold mr-6 select-none text-blue-700">
        Spreadsheet
      </h1>
      <button
        className="px-3 py-1 text-sm rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        onClick={() => dispatch(undo())}
      >
        Undo
      </button>
      <button
        className="px-3 py-1 text-sm rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        onClick={() => dispatch(redo())}
      >
        Redo
      </button>
      
      <div className="mx-2 h-6 border-l border-gray-300"></div>
      
      <CommentsButton />
      
      <button
        className="px-3 py-1 text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition ml-auto"
        title="Keyboard Shortcuts"
      >
        ⌨️
      </button>
    </header>
  )
}

export default Toolbar
