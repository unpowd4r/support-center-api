import express from "express";
import swaggerUi from "swagger-ui-express";

import { ticketsRouter } from "./modules/tickets/tickets.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { swaggerDocument } from "./docs/swagger.ts";

const app = express();

app.use(express.json());

app.use("/api/tickets", ticketsRouter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

export { app };
