import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const isError = err instanceof Error;

  if (statusCode >= 500) {
    console.error("Unhandled error:", err);
  }

  res.status(statusCode).json({
    ok: false,
    error: {
      code: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      message: statusCode === 500 ? "Internal server error" : isError ? err.message : "Request failed",
      ...(env.isProduction || !isError ? {} : { details: err.stack })
    }
  });
};
