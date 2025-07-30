export const IS_PRODUCTION =
  import.meta.env.MODE === "production" || import.meta.env.VITE_NODE_ENV === "production";

export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || "development";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const WEBSOCKET_BASE_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
  
export const FEATURE_FLAGS = {
  enableCSV: !!import.meta.env.VITE_FEATURE_CSV,
  enableMultipleSheets: !!import.meta.env.VITE_FEATURE_MULTISHEET,
  enableCharts: !!import.meta.env.VITE_FEATURE_CHARTS
};

export const DEBUG_CONFIG = {
  debugMode: !!import.meta.env.VITE_DEBUG_MODE,
  enableConsoleLogs: !!import.meta.env.VITE_ENABLE_CONSOLE_LOGS,
};

export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || "Spreadsheet Application",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
};

export const PERFORMANCE_CONFIG = {
  virtualScrolling: !!import.meta.env.VITE_VIRTUAL_SCROLLING,
  lazyLoading: !!import.meta.env.VITE_LAZY_LOADING,
};

export const AUTH_CONFIG = {
  enabled: !!import.meta.env.VITE_AUTH_ENABLED,
  storageKey: import.meta.env.VITE_JWT_STORAGE_KEY || "spreadsheet_auth_token",
};
