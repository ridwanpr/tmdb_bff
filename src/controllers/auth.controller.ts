import bcrypt from "bcrypt";
import { auth } from "../lib/auth.js";
import type { Request, Response } from "express";
import { signUpSchema } from "../schema/auth.schema.js";

export const AuthController = () => {
  const signUp = async (req: Request, res: Response) => {
    const body = signUpSchema.parse(req.body);

    const password = await bcrypt.hash(body.password, 12);

    const data = await auth.api.signUpEmail({
      body: {
        name: body.name,
        email: body.email,
        password: password,
      },
    });

    return res.json({
      success: true,
      message: "Sign up success",
      data: data,
    });
  };

  return { signUp };
};
