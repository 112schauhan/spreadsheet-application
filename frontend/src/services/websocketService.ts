
import { getWebSocketSheetURL } from '../config/websocket';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WSListener = (data: any) => void;

export default class WebsocketService {
  private ws: WebSocket;
  private listeners: WSListener[] = [];
  private onOpenCallbacks: (() => void)[] = [];

  constructor(sheetId: string) {
    // Use the centralized WebSocket URL configuration
    const wsUrl = getWebSocketSheetURL(sheetId);
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
      // Trigger any onopen callbacks if needed
      this.onOpenCallbacks.forEach(callback => callback());
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach((listener) => listener(data));
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    this.ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };
  }

  /**
   * Send a message through the WebSocket.
   */
  send(data: object) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open. Cannot send message", data);
    }
  }

  onMessage(callback: WSListener): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  onOpen(callback: () => void): () => void {
    this.onOpenCallbacks.push(callback);
    return () => {
      this.onOpenCallbacks = this.onOpenCallbacks.filter((c) => c !== callback);
    };
  }

  close() {
    this.ws.close();
  }
}
