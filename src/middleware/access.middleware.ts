import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";
import { prisma } from "../lib/prisma.js";
import { ResponseError } from "../exceptions/responseError.js";

export const accessMiddleware = (requiredPermission: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ResponseError(401, "Unauthorized");
      }

      const hasPermission = await prisma.userRole.findFirst({
        where: {
          user_id: req.user.id,
          role: {
            rolePermissions: {
              some: {
                permission: {
                  slug: requiredPermission,
                },
              },
            },
          },
        },
      });

      if (!hasPermission) {
        throw new ResponseError(403, "Forbidden: Insufficient permissions");
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
