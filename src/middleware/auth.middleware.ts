import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { ResponseError } from "../exceptions/responseError.js";

export interface AuthRequest extends Request {
  user?: typeof auth.$Infer.Session.user;
  session?: typeof auth.$Infer.Session.session;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw new ResponseError(401, "Unauthorized");
    }

    const authReq = req as AuthRequest;
    authReq.user = session.user;
    authReq.session = session.session;

    next();
  } catch (error) {
    next(error);
  }
};
