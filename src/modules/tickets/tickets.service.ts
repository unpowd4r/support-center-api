import crypto from "node:crypto";

import { messages, tickets } from "./tickets.store.ts";

import type { Message, Ticket, TicketPriority } from "./tickets.types.ts";

import {
  ticketAlreadyAssignedError,
  ticketNotFoundError,
  ticketResolvedError,
} from "../../errors/tickets-errors.ts";

export const getTickets = (): Ticket[] => {
  return tickets;
};

export const getTicketById = (id: string): Ticket | undefined => {
  return tickets.find((ticket) => ticket.id === id);
};

export const createTicket = (
  subject: string,
  priority: TicketPriority = "NORMAL",
): Ticket => {
  const now = new Date().toISOString();

  const ticket: Ticket = {
    id: crypto.randomUUID(),
    subject,
    priority,
    status: "NEW",
    createdAt: now,
    lastMessageAt: now,
    assignedTo: null,
  };

  tickets.push(ticket);

  return ticket;
};

export const getTicketMessages = (ticketId: string): Message[] => {
  return messages.filter((message) => message.ticketId === ticketId);
};

export const createOperatorMessage = (
  ticketId: string,
  text: string,
): Message => {
  const message: Message = {
    id: crypto.randomUUID(),
    ticketId,
    author: "OPERATOR",
    text,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);

  const ticket = getTicketById(ticketId);

  if (ticket) {
    ticket.lastMessageAt = message.createdAt;
  }

  return message;
};

export const assignTicket = (ticketId: string, operatorId: string): Ticket => {
  const ticket = getTicketById(ticketId);

  if (!ticket) {
    throw ticketNotFoundError();
  }

  if (ticket.status === "RESOLVED") {
    throw ticketResolvedError();
  }

  if (ticket.assignedTo !== null) {
    throw ticketAlreadyAssignedError();
  }

  ticket.assignedTo = operatorId;
  ticket.status = "IN_PROGRESS";

  return ticket;
};

export const getTicketStatusById = (
  ticketId: string,
): { id: string; status: Ticket["status"] } => {
  const ticket = getTicketById(ticketId);

  if (!ticket) {
    throw ticketNotFoundError();
  }

  return {
    id: ticket.id,
    status: ticket.status,
  };
};
