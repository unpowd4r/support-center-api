import type { Server } from "node:http";

import { WebSocketServer } from "ws";

import { setWebSocketServer } from "./realtime.service.ts";

export const createWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  setWebSocketServer(wss);

  wss.on("connection", (socket) => {
    console.log("WebSocket client connected");

    socket.send(
      JSON.stringify({
        type: "connection.ready",
        payload: {
          message: "Connected",
        },
      }),
    );

    socket.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  return wss;
};
