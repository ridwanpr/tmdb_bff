import type { Request, Response, NextFunction } from "express";
import { ResponseError } from "../exceptions/responseError.js";
import { prisma } from "../lib/prisma.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.session_token;

    if (!token) {
      throw new ResponseError(401, "Unauthorized");
    }

    const session = await prisma.session.findUnique({
      where: { session_token: token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!session || session.expires_at < new Date()) {
      throw new ResponseError(401, "Unauthorized");
    }

    req.user = session.user;

    return next();
  } catch (error) {
    return next(error);
  }
};
