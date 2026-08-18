export const ErrorCode = {
  TICKET_NOT_FOUND: "TICKET_NOT_FOUND",
  TICKET_ALREADY_ASSIGNED: "TICKET_ALREADY_ASSIGNED",
  TICKET_RESOLVED: "TICKET_RESOLVED",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
