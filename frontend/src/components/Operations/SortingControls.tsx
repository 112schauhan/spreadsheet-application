import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSort } from "../../store/operationsSlice";
import { DEFAULT_COLUMNS } from "../../config/constants";

const colLabels = Array.from({ length: DEFAULT_COLUMNS }, (_, i) =>
  String.fromCharCode(65 + i)
);

const SortingControls: React.FC = () => {
  const dispatch = useDispatch();
  const [column, setColumn] = useState<string>("A");
  const [ascending, setAscending] = useState<boolean>(true);

  const handleSort = () => {
    dispatch(setSort({ column, ascending }));
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded shadow border border-gray-200">
      <span>Sort column:</span>
      <select
        value={column}
        onChange={e => setColumn(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        {colLabels.map(c => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        className={`px-2 py-1 rounded ${
          ascending
            ? "bg-blue-100 text-blue-800 border border-blue-300"
            : "bg-gray-100 text-gray-700 border border-gray-200"
        }`}
        onClick={() => setAscending(true)}
      >
        Asc
      </button>
      <button
        className={`px-2 py-1 rounded ${
          !ascending
            ? "bg-blue-100 text-blue-800 border border-blue-300"
            : "bg-gray-100 text-gray-700 border border-gray-200"
        }`}
        onClick={() => setAscending(false)}
      >
        Desc
      </button>
      <button
        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSort}
      >
        Sort
      </button>
    </div>
  );
};

export default SortingControls;