import WebSocket from "ws";
import type { WebSocketServer } from "ws";

let webSocketServer: WebSocketServer | null = null;

export const setWebSocketServer = (server: WebSocketServer) => {
  webSocketServer = server;
};

export const broadcast = (event: unknown) => {
  if (!webSocketServer) {
    return;
  }

  const data = JSON.stringify(event);

  for (const client of webSocketServer.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
};
