/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ErrorRequestHandler } from "express";
import { ExternalServiceError, ResponseError } from "../exceptions/responseError.js";
import { logging } from "../config/logging.js";

export const errorMiddleware: ErrorRequestHandler = (error, request, response, next) => {
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
    const isDevEnv = process.env.NODE_ENV === "development" ? true : false;
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
