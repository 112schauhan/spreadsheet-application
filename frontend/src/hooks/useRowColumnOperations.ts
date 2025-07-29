import { useDispatch, useSelector } from "react-redux"
import { type RootState } from "../store"
import {
  addRow,
  deleteRow,
  addColumn,
  deleteColumn,
} from "../store/operationsSlice"

const useRowColumnOperations = () => {
  const dispatch = useDispatch()
  const { rows, columns } = useSelector((state: RootState) => state.grid)
  return {
    addRowHandler: () => {
      if (rows < 1000) dispatch(addRow())
    },
    deleteRowHandler: () => {
      if (rows > 1) dispatch(deleteRow())
    },
    addColumnHandler: () => {
      if (columns < 26) dispatch(addColumn())
    },
    deleteColumnHandler: () => {
      if (columns > 1) dispatch(deleteColumn())
    },
  }
}

export default useRowColumnOperations
