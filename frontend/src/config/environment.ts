export const IS_PRODUCTION =
  import.meta.env.MODE === "production" || import.meta.env.VITE_NODE_ENV === "production";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
  
export const FEATURE_FLAGS = {
  enableCSV: !!import.meta.env.VITE_FEATURE_CSV,
  enableMultipleSheets: !!import.meta.env.VITE_FEATURE_MULTISHEET,
  enableCharts: !!import.meta.env.VITE_FEATURE_CHARTS
};
