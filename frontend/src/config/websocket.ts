import { WEBSOCKET_BASE_URL } from './environment';

export const getWebSocketURL = WEBSOCKET_BASE_URL;
  
export function getWebSocketSheetURL(sheetId: string): string {
  // Remove /ws suffix if it exists and add proper path
  const baseUrl = WEBSOCKET_BASE_URL.replace(/\/ws$/, '');
  return `${baseUrl}/ws/spreadsheet/${sheetId}`;
}
