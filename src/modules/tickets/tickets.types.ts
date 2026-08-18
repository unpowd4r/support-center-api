export type TicketStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "RESOLVED";

export type TicketPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";

export type Ticket = {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  lastMessageAt: string;
  assignedTo: string | null;
};

export type Message = {
  id: string;
  ticketId: string;
  author: "CLIENT" | "OPERATOR";
  text: string;
  createdAt: string;
};
