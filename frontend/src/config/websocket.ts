export const WEBSOCKET_BASE_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
  
export function getWebSocketURL(sheetId: string): string {
  // Compose URL: e.g., ws://localhost:8000/ws/sheet/{sheetId}
  return `${WEBSOCKET_BASE_URL}/sheet/${sheetId}`;
}
