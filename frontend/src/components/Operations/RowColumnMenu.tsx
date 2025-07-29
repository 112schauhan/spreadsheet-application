import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRow, deleteRow, addColumn, deleteColumn } from "../../store/operationsSlice";
import { type RootState } from "../../store";

const RowColumnMenu: React.FC = () => {
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.operations.rows);
  const columns = useSelector((state: RootState) => state.operations.columns);

  return (
    <div className="flex flex-col space-y-2 p-4 bg-white rounded shadow border border-gray-200">
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          onClick={() => dispatch(addRow())}
        >
          + Row
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60"
          onClick={() => dispatch(deleteRow())}
          disabled={rows <= 1}
        >
          – Row
        </button>
        <span className="text-gray-500">Rows: {rows}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          onClick={() => dispatch(addColumn())}
        >
          + Column
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60"
          onClick={() => dispatch(deleteColumn())}
          disabled={columns <= 1}
        >
          – Column
        </button>
        <span className="text-gray-500">Columns: {columns}</span>
      </div>
    </div>
  );
};

export default RowColumnMenu;