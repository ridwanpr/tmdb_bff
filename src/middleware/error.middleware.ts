/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodError } from "zod";
import { logging } from "../config/logging.js";
import type { ErrorRequestHandler } from "express";
import { ExternalServiceError, ResponseError } from "../exceptions/responseError.js";

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

  if (error instanceof ExternalServiceError) {
    return response.status(error.status).json({
      success: false,
      type: "External Service Error",
      message: error.message,
      service: error.service,
    });
  }

  if (error instanceof ResponseError) {
    return response.status(error.status).json({
      success: false,
      type: "Response error",
      message: error.message,
    });
  } else {
    if (isDevEnv) console.log(error);

    logging.error(error.message, { stack: error.stack });
    return response.status(500).json({
      success: false,
      type: "Internal Server Error",
      message: error.message,
      ...(isDevEnv && { stack: error.stack }),
    });
  }
};
