import type { ErrorRequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      code: error.code,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Внутренняя ошибка сервера",
  });
};
