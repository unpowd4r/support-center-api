import { Router } from "express";

import {
  assignTicketController,
  createTicketController,
  createTicketMessageController,
  getTicketController,
  getTicketMessagesController,
  getTicketsController,
  getTicketStatusController,
  updateTicketStatusController,
} from "./tickets.controller.js";

export const ticketsRouter = Router();

ticketsRouter.get("/", getTicketsController);
ticketsRouter.get("/:id", getTicketController);
ticketsRouter.post("/", createTicketController);
ticketsRouter.post("/:id/assign", assignTicketController);
ticketsRouter.get("/:id/messages", getTicketMessagesController);
ticketsRouter.post("/:id/messages", createTicketMessageController);
ticketsRouter.get("/:id/status", getTicketStatusController);
ticketsRouter.post("/:id/status", updateTicketStatusController);
