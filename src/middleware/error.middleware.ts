/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodError } from "zod";
import { logging } from "../config/logging.js";
import type { ErrorRequestHandler } from "express";
import { ExternalServiceError, ResponseError } from "../exceptions/responseError.js";
import { Prisma } from "../generated/prisma/client.js";

const HTTP_STATUS_TYPES: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  408: "Request Timeout",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
};

export const errorMiddleware: ErrorRequestHandler = (error, request, response, next) => {
  const isDevEnv = process.env.NODE_ENV === "development";

  if (error instanceof ZodError || error?.name === "ZodError") {
    const zodError = error as ZodError;

    const details = zodError.issues.map((issue) => {
      if (issue.path.length === 0 && issue.code === "invalid_type") {
        return {
          field: "body",
          message: "Request body is required",
        };
      }
      return {
        field: issue.path.join(".") || "unknown",
        message: issue.message,
      };
    });

    if (isDevEnv) {
      console.error(zodError);
      logging.error(`Validation Error`, { errors: details });
    }

    return response.status(400).json({
      success: false,
      type: "Validation Error",
      message: "The provided request payload is invalid.",
      errors: details,
    });
  }

  // Third-Party API Outages
  if (error instanceof ExternalServiceError) {
    logging.error(
      `External Service Failure: Upstream target [${error.service}] returned status ${error.status}`,
      {
        message: error.message,
        stack: error.stack,
      },
    );

    return response.status(error.status).json({
      success: false,
      type: "External Service Error",
      message: error.message,
      service: error.service,
    });
  }

  // Prisma Database Engine Failures
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logging.error(`Database Query Exception [${error.code}]: ${error.message}`, {
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });

    switch (error.code) {
      case "P2025":
        return response
          .status(404)
          .json({ success: false, type: "NotFoundError", message: "Record not found." });
      case "P2002":
        return response
          .status(409)
          .json({ success: false, type: "ConflictError", message: "This record already exists." });
      case "P2003":
        return response.status(400).json({
          success: false,
          type: "ValidationError",
          message: "Cannot delete or update because of a relation constraint.",
        });
      default:
        return response
          .status(500)
          .json({ success: false, type: "DatabaseError", message: "A database error occurred." });
    }
  }

  if (error instanceof ResponseError) {
    if (error.status >= 500) {
      logging.error(`Explicit Application Fault [${error.status}]: ${error.message}`, {
        stack: error.stack,
      });
    }

    const errorType = HTTP_STATUS_TYPES[error.status] || "Response Error";

    return response.status(error.status).json({
      success: false,
      type: errorType,
      message: error.message,
    });
  }

  // Unhandled Runtime Crashes
  else {
    if (isDevEnv) console.log(error);

    logging.error(`Unhandled Runtime Exception: ${error.message}`, {
      stack: error.stack,
    });

    return response.status(500).json({
      success: false,
      type: "Internal Server Error",
      message: error.message,
      ...(isDevEnv && { stack: error.stack }),
    });
  }
};
