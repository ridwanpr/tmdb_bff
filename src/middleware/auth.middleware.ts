import type { Request, Response, NextFunction } from "express";
// import { ResponseError } from "../exceptions/responseError.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  next();
};
