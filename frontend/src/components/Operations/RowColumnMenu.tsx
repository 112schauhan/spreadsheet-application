import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { insertRowAfter, deleteRowAt, insertColumnAfter, deleteColumnAt } from "../../store/gridSlice";
import { type RootState } from "../../store";

const RowColumnMenu: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedRows, selectedColumns } = useSelector((state: RootState) => state.selection);
  const rows = useSelector((state: RootState) => state.operations.rows);
  const columns = useSelector((state: RootState) => state.operations.columns);

  const handleInsertRow = () => {
    if (selectedRows.length > 0) {
      // Insert after the last selected row
      const lastSelectedRow = Math.max(...selectedRows);
      dispatch(insertRowAfter(lastSelectedRow));
    }
  };

  const handleDeleteRow = () => {
    if (selectedRows.length > 0) {
      // Delete the first selected row (delete one at a time for simplicity)
      const firstSelectedRow = Math.min(...selectedRows);
      dispatch(deleteRowAt(firstSelectedRow));
    }
  };

  const handleInsertColumn = () => {
    if (selectedColumns.length > 0) {
      // Insert after the last selected column
      const lastSelectedColumn = selectedColumns.sort().pop();
      if (lastSelectedColumn) {
        dispatch(insertColumnAfter(lastSelectedColumn));
      }
    }
  };

  const handleDeleteColumn = () => {
    if (selectedColumns.length > 0) {
      // Delete the first selected column (delete one at a time for simplicity)
      const firstSelectedColumn = selectedColumns.sort()[0];
      dispatch(deleteColumnAt(firstSelectedColumn));
    }
  };

  const getRowButtonText = () => {
    if (selectedRows.length > 0) {
      const lastRow = Math.max(...selectedRows);
      return `Insert Row After ${lastRow}`;
    }
    return 'Select a row to add';
  };

  const getColumnButtonText = () => {
    if (selectedColumns.length > 0) {
      const lastColumn = selectedColumns.sort().pop();
      return `Insert Column After ${lastColumn}`;
    }
    return 'Select a column to add';
  };

  const getDeleteRowText = () => {
    if (selectedRows.length > 0) {
      const firstRow = Math.min(...selectedRows);
      return `Delete Row ${firstRow}`;
    }
    return 'Delete Row (select row first)';
  };

  const getDeleteColumnText = () => {
    if (selectedColumns.length > 0) {
      const firstColumn = selectedColumns.sort()[0];
      return `Delete Column ${firstColumn}`;
    }
    return 'Delete Column (select column first)';
  };

  return (
    <div className="flex flex-col space-y-2 p-4 bg-white rounded shadow border border-gray-200">
      <div className="flex items-center space-x-2">
        <button
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleInsertRow}
          disabled={selectedRows.length === 0}
          title={getRowButtonText()}
        >
          <span className="text-sm font-bold">+</span>
          Row
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleDeleteRow}
          disabled={selectedRows.length === 0 || rows <= 1}
          title={getDeleteRowText()}
        >
          <span className="text-sm font-bold">−</span>
          Row
        </button>
        <span className="text-gray-500">Rows: {rows}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleInsertColumn}
          disabled={selectedColumns.length === 0}
          title={getColumnButtonText()}
        >
          <span className="text-sm font-bold">+</span>
          Column
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleDeleteColumn}
          disabled={selectedColumns.length === 0 || columns <= 1}
          title={getDeleteColumnText()}
        >
          <span className="text-sm font-bold">−</span>
          Column
        </button>
        <span className="text-gray-500">Columns: {columns}</span>
      </div>
      
      {(selectedRows.length > 0 || selectedColumns.length > 0) && (
        <div className="text-sm text-gray-600 border-t pt-2">
          {selectedRows.length > 0 && (
            <div>Selected Row{selectedRows.length > 1 ? 's' : ''}: {selectedRows.join(', ')}</div>
          )}
          {selectedColumns.length > 0 && (
            <div>Selected Column{selectedColumns.length > 1 ? 's' : ''}: {selectedColumns.join(', ')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RowColumnMenu;