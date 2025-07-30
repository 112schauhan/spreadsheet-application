import React, { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { parseCellRef, colToIndex, getCellRangeRefs } from "../../utils/cellUtils";
import { type CellData } from "../../types/grid.types";
import ChartModal from "./ChartModal";

const CHART_TYPES = ["Bar", "Line", "Pie"];

function extractChartData(range: string, cells: Record<string, CellData>) {
  // range: "A2:B5" etc.
  try {
    const [start, end] = range.split(":");
    const refs = getCellRangeRefs(start.trim(), end.trim());
    // Detect columns and rows
    const startCol = parseCellRef(start.trim()).col;
    const endCol = parseCellRef(end.trim()).col;
    const colIdxs = [colToIndex(startCol), colToIndex(endCol)].sort((a, b) => a - b);
    const numCols = colIdxs[1] - colIdxs[0] + 1;

    // Group refs into rows
    const data: Record<string, string | number>[] = [];
    for (let i = 0; i < refs.length; i += numCols) {
      const rowRefs = refs.slice(i, i + numCols);
      const rowObj: Record<string, string | number> = {};
      rowRefs.forEach((ref, j) => {
        const cell = cells[ref];
        // Use header in row 1 as key if available, else col letter
        if (rowRefs[0].match(/\d+$/)) {
          const colLetter = String.fromCharCode(65 + colIdxs[j]);
          const headerCell = cells[`${colLetter}1`];
          const headerValue = headerCell?.value !== null ? String(headerCell?.value || '') : colLetter;
          rowObj[headerValue] = cell?.value !== null ? cell?.value ?? "" : "";
        }
      });
      data.push(rowObj);
    }
    return data;
  } catch {
    return [];
  }
}

const ChartGenerator: React.FC = () => {
  const [chartType, setChartType] = useState<string>("Bar");
  const [dataRange, setDataRange] = useState<string>("A2:B5");
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chartData, setChartData] = useState<Record<string, string | number>[]>([]);

  const cells = useSelector((state: RootState) => state.grid.cells);

  const onGenerateChart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataRange.match(/^[A-Z]+\d+:[A-Z]+\d+$/)) {
      setError("Range format must be like A2:B5");
      return;
    }
    const data = extractChartData(dataRange, cells);
    if (!data.length) {
      setError("No data found in the selected range.");
      return;
    }
    setChartData(data);
    setError(null);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-5 bg-white border border-gray-300 shadow rounded max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Chart Generator</h2>
      <form onSubmit={onGenerateChart} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="chartType">
            Chart Type
          </label>
          <select
            id="chartType"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            {CHART_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700" htmlFor="dataRange">
            Data Range
          </label>
          <input
            id="dataRange"
            type="text"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. A2:B5"
            value={dataRange}
            onChange={(e) => setDataRange(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span>📊</span>
          Generate Chart
        </button>
        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">💡 <strong>Tips:</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Include headers in row 1</li>
          <li>Select data with numeric values</li>
          <li>Try ranges like A1:C10</li>
        </ul>
      </div>

      <ChartModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        chartType={chartType}
        chartData={chartData}
        dataRange={dataRange}
      />
    </div>
  );
};

export default ChartGenerator;