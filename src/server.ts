import { createServer } from "node:http";

import { app } from "./app.js";
import { createWebSocketServer } from "./realtime/websocket.ts";

const PORT = 3030;

const server = createServer(app);

createWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/docs`);
  console.log(`WebSocket: ws://localhost:${PORT}/ws`);
});
