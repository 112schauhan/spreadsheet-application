import React, { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { parseCellRef, colToIndex, getCellRangeRefs } from "../../utils/cellUtils";
import { type CellData } from "../../types/grid.types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell as ChartCell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CHART_TYPES = ["Bar", "Line", "Pie"];

const COLORS = ["#4F46E5", "#F59E42", "#22B573", "#E6468D", "#1976D2"];

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
  const [chartReady, setChartReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cells = useSelector((state: RootState) => state.grid.cells);

  const [chartData, setChartData] = useState<Record<string, string | number>[]>([]);

  const onGenerateChart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataRange.match(/^[A-Z]+\d+:[A-Z]+\d+$/)) {
      setError("Range format must be like A2:B5");
      setChartReady(false);
      return;
    }
    const data = extractChartData(dataRange, cells);
    if (!data.length) {
      setError("No data found in the selected range.");
      setChartReady(false);
      return;
    }
    setChartData(data);
    setChartReady(true);
    setError(null);
  };

  const onReset = () => {
    setChartReady(false);
    setError(null);
  };

  // Figure out numeric columns for graphing
  const keys = chartData.length ? Object.keys(chartData[0] || {}) : [];
  const numericKeys = keys.filter(
    (k) => chartData.some((row) => !isNaN(Number(row[k])))
  );

  // No longer needed as we'll render charts directly

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
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Generate Chart
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
            onClick={onReset}
            disabled={!chartReady}
          >
            Reset
          </button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>

      {chartReady && chartData.length > 0 && numericKeys.length > 0 && (
        <div className="mt-7 w-full h-72">
          {chartType === "Bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={keys[0]} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {numericKeys.map((k, i) => (
                    <Bar dataKey={k} fill={COLORS[i % COLORS.length]} key={k} />
                  ))}
                </BarChart>
              </>
            </ResponsiveContainer>
          )}
          {chartType === "Line" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={keys[0]} />
                <YAxis />
                <Tooltip />
                <Legend />
                {numericKeys.map((k, i) => (
                  <Line
                    type="monotone"
                    dataKey={k}
                    stroke={COLORS[i % COLORS.length]}
                    key={k}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
          {chartType === "Pie" && numericKeys.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={chartData}
                  dataKey={numericKeys[0]}
                  nameKey={keys[0]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={COLORS[0]}
                  label
                >
                  {chartData.map((_, i) => (
                    <ChartCell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
      {chartReady && numericKeys.length === 0 && (
        <div className="text-red-500 mt-4">No numeric data found in selection.</div>
      )}
    </div>
  );
};

export default ChartGenerator;