import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../store"
import { recordChange, undo, redo } from "../store/historySlice"

const useUndoRedo = () => {
  const dispatch = useDispatch()
  const { past, future } = useSelector((state: RootState) => state.history)
  const undoHandler = () => {
    if (past.length > 0) dispatch(undo())
  }
  const redoHandler = () => {
    if (future.length > 0) dispatch(redo())
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recordChangeHandler = (change: any) => dispatch(recordChange(change))
  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undoHandler,
    redoHandler,
    recordChangeHandler,
  }
}
export default useUndoRedo
