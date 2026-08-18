import { AppError } from "./app-error.ts";
import { ErrorCode } from "./error-codes.ts";

export const ticketNotFoundError = () =>
  new AppError(ErrorCode.TICKET_NOT_FOUND, 404, "Тикет не найден");

export const ticketResolvedError = () =>
  new AppError(ErrorCode.TICKET_RESOLVED, 409, "Тикет уже закрыт");

export const ticketAlreadyAssignedError = () =>
  new AppError(
    ErrorCode.TICKET_ALREADY_ASSIGNED,
    409,
    "У тикета уже есть назначенный оператор",
  );
