import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

interface RequestSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

export const validate = (schemas: RequestSchemas) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(req.query)) as typeof req.query;
      }
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(req.params)) as typeof req.params;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
