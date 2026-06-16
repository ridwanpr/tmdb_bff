import type { Request, Response } from "express";
import { signUpSchema } from "../schema/auth.schema.js";

export const AuthController = () => {
  const signUp = (req: Request, res: Response) => {
    const body = signUpSchema.parse(req.body);

    return res.json({
      data: body,
    });
  };

  return { signUp };
};
