import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { ticketsRouter } from "./modules/tickets/tickets.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { swaggerDocument } from "./docs/swagger.ts";
import { env } from "./config/env.ts";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGINS,
  }),
);

app.use(express.json());

app.use("/api/tickets", ticketsRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

export { app };
