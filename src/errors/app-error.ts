import type { ErrorCode } from "./error-codes.js";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(code: ErrorCode, statusCode: number, message: string) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}
