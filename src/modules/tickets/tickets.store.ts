import type { Message, Ticket } from "./tickets.types.js";

export const tickets: Ticket[] = [
  {
    id: "1",
    subject: "Не проходит оплата",
    status: "NEW",
    priority: "HIGH",
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    assignedTo: null,
  },
  {
    id: "2",
    subject: "Не могу войти",
    status: "NEW",
    priority: "NORMAL",
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString(),
    assignedTo: null,
  },
];

export const messages: Message[] = [];
