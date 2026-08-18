import type { Request, Response } from "express";

import {
  assignTicket,
  createOperatorMessage,
  createTicket,
  getTicketById,
  getTicketMessages,
  getTicketStatusById,
  getTickets,
  updateTicketStatus,
} from "./tickets.service.js";

import type { TicketPriority, TicketStatus } from "./tickets.types.js";

export const getTicketsController = (req: Request, res: Response) => {
  const tickets = getTickets();

  res.json(tickets);
};

export const getTicketController = (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({
      message: "Неверный формат ID",
    });
  }

  const ticket = getTicketById(id);

  if (!ticket) {
    return res.status(404).json({
      message: "Тикет не найден",
    });
  }

  res.json(ticket);
};

export const createTicketController = (req: Request, res: Response) => {
  const { subject, priority } = req.body;

  if (!subject) {
    return res.status(400).json({
      message: "Поле subject обязательно",
    });
  }

  //TODO: Добавить валидацию нового тикет статуса без as
  const ticket = createTicket(subject, priority as TicketPriority | undefined);

  res.status(201).json(ticket);
};

export const assignTicketController = (req: Request, res: Response) => {
  const { operatorId } = req.body;
  const { id } = req.params;

  if (!operatorId) {
    return res.status(422).json({
      message: "Поле operatorId обязательно",
    });
  }

  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({
      message: "Неверный формат ID",
    });
  }

  const ticket = assignTicket(id, operatorId);

  return res.json(ticket);
};

export function getTicketMessagesController(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({
      message: "Неверный формат ID",
    });
  }

  const ticket = getTicketById(id);

  if (!ticket) {
    return res.status(404).json({
      message: "Тикет не найден",
    });
  }

  const messages = getTicketMessages(id);

  res.json(messages);
}

export function createTicketMessageController(req: Request, res: Response) {
  const { text } = req.body;
  const { id } = req.params;

  if (!text) {
    return res.status(400).json({
      message: "Поле text обязательно",
    });
  }

  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({
      message: "Неверный формат ID",
    });
  }

  const ticket = getTicketById(id);

  if (!ticket) {
    return res.status(404).json({
      message: "Тикет не найден",
    });
  }

  const message = createOperatorMessage(id, text);

  res.status(201).json(message);
}

export const getTicketStatusController = (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({
      message: "Неверный формат ID",
    });
  }

  const status = getTicketStatusById(id);

  res.status(200).json(status);
};

export const updateTicketStatusController = (req: Request, res: Response) => {
  const { id } = req.params;
  const { newTicketStatus } = req.body;

  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({
      message: "Неверный формат ID",
    });
  }

  //TODO: Добавить валидацию нового тикет статуса без as
  const updatedTicketStatus = updateTicketStatus(
    id,
    newTicketStatus as TicketStatus,
  );

  res.status(202).json(updatedTicketStatus);
};
