import { createServer } from "node:http";

import { app } from "./app.js";
import { createWebSocketServer } from "./realtime/websocket.ts";
import { env } from "./config/env.ts";

const server = createServer(app);
const PORT = env.PORT;

createWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/docs`);
  console.log(`WebSocket: ws://localhost:${PORT}/ws`);
});
