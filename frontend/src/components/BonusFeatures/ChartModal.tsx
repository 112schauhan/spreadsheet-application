import React from "react";
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

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartType: string;
  chartData: Record<string, string | number>[];
  dataRange: string;
}

const COLORS = ["#4F46E5", "#F59E42", "#22B573", "#E6468D", "#1976D2", "#9333EA", "#DC2626", "#059669"];

const ChartModal: React.FC<ChartModalProps> = ({
  isOpen,
  onClose,
  chartType,
  chartData,
  dataRange,
}) => {
  if (!isOpen) return null;

  // Figure out numeric columns for graphing
  const keys = chartData.length ? Object.keys(chartData[0] || {}) : [];
  const numericKeys = keys.filter(
    (k) => chartData.some((row) => !isNaN(Number(row[k])))
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {chartType} Chart
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Data Range: {dataRange} • {chartData.length} data points
            </p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 text-3xl font-light"
            onClick={onClose}
            title="Close Chart"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Chart Content */}
          <div className="p-8">
            {chartData.length > 0 && numericKeys.length > 0 ? (
              <div className="w-full" style={{ height: '500px' }}>
                {chartType === "Bar" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey={keys[0]} 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <Legend />
                      {numericKeys.map((k, i) => (
                        <Bar 
                          dataKey={k} 
                          fill={COLORS[i % COLORS.length]} 
                          key={k}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                )}
                
                {chartType === "Line" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey={keys[0]} 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <Legend />
                      {numericKeys.map((k, i) => (
                        <Line
                          type="monotone"
                          dataKey={k}
                          stroke={COLORS[i % COLORS.length]}
                          strokeWidth={3}
                          dot={{ r: 6 }}
                          key={k}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
                
                {chartType === "Pie" && numericKeys.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <Legend />
                      <Pie
                        data={chartData}
                        dataKey={numericKeys[0]}
                        nameKey={keys[0]}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill={COLORS[0]}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        labelLine={false}
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
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-600">
                    {numericKeys.length === 0 
                      ? "No numeric data found in the selected range." 
                      : "No data found in the selected range."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Data Summary */}
          {chartData.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Data Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded border">
                  <div className="text-gray-600">Total Rows</div>
                  <div className="text-xl font-semibold text-blue-600">{chartData.length}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-gray-600">Columns</div>
                  <div className="text-xl font-semibold text-green-600">{keys.length}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-gray-600">Numeric Columns</div>
                  <div className="text-xl font-semibold text-purple-600">{numericKeys.length}</div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="text-gray-600">Chart Type</div>
                  <div className="text-xl font-semibold text-orange-600">{chartType}</div>
                </div>
              </div>
              
              {numericKeys.length > 0 && (
                <div className="mt-4">
                  <div className="text-gray-600 mb-2">Numeric Columns:</div>
                  <div className="flex flex-wrap gap-2">
                    {numericKeys.map((key, index) => (
                      <span 
                        key={key}
                        className="px-3 py-1 bg-white border rounded-full text-sm font-medium"
                        style={{ borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end flex-shrink-0">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;
