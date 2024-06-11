// WebSocketConnection.ts

interface WebSocketEventMap {
  open: Event;
  close: CloseEvent;
  error: Event;
  message: MessageEvent;
}

type WebSocketEventListener<K extends keyof WebSocketEventMap> = (
  event: WebSocketEventMap[K]
) => void;

class WebSocketConnection {
  private ws: WebSocket | null = null;
  private url: string;
  private clientId: string;
  private reconnectInterval: number;
  private reconnectTimer: NodeJS.Timeout | null;
  private heartbeatInterval: number;
  private heartbeatTimer: NodeJS.Timeout | null;

  constructor(
    url: string,
    clientId: string,
    heartbeatTimeout: number = 5000,
    reconnectInterval: number = 3000
  ) {
    this.url = url;
    this.clientId = clientId;
    this.reconnectInterval = reconnectInterval;
    this.reconnectTimer = null;
    this.heartbeatInterval = heartbeatTimeout; // Heartbeat interval (2 seconds)
    this.heartbeatTimer = null;
    this.connect();
  }

  private connect(): void {
    console.log('====connect=======> ');
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener("open", this.onOpen.bind(this));
    this.ws.addEventListener("close", this.onClose.bind(this));
    this.ws.addEventListener("error", this.onError.bind(this));
    this.ws.addEventListener("message", this.onMessage.bind(this));
  }

  private reconnect(): void {
    console.log('====reconnect=======> ');
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
      this.reconnectTimer = null;
    }, this.reconnectInterval);
  }

  public send(data: string | ArrayBuffer | Blob | ArrayBufferView): void {
    console.log('====send=======> ');
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.error("WebSocket connection is not open. Cannot send data.");
    }
  }

  public close(): void {
    console.log('====close=======> ');
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
      this.ws.close();
    }
    this.stopHeartbeat();
  }

  public on<K extends keyof WebSocketEventMap>(
    event: K,
    listener: WebSocketEventListener<K>
  ): void {
    console.log('====on=======> ');
    this.ws && this.ws.addEventListener(event, listener as EventListener);
  }

  private onOpen(event: Event): void {
    console.log('====onOpen=======> ');
    this.startHeartbeat();
  }

  private onClose(event: CloseEvent): void {
    console.log('====onClose=======> ');
    this.stopHeartbeat();
    this.reconnect();
  }

  private onError(event: Event): void {
    console.log('====onError=======> ', event);
    // this.reconnect();
  }

  private onMessage(event: MessageEvent): void {
    console.log('====onMessage=======> ', event.data);
    // this.resetHeartbeat();
  }

  private startHeartbeat(): void {
    console.log('====startHeartbeat=======> ');
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const pingEvent = JSON.stringify({
          event: 'ping',
          data: this.clientId,
        });
        this.send(pingEvent);
      } else {
        this.stopHeartbeat();
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    console.log('====stopHeartbeat=======> ');
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private resetHeartbeat(): void {
    this.stopHeartbeat();
    this.startHeartbeat();
  }
}

export default WebSocketConnection;
