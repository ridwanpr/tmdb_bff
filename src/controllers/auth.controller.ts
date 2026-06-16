import type { Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { loginSchema, signUpSchema } from "../schema/auth.schema.js";

export const AuthController = () => {
  const signUp = async (req: Request, res: Response) => {
    const body = signUpSchema.parse(req.body);

    const authResponse = await auth.api.signUpEmail({
      body: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    authResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const data = await authResponse.json();

    return res.json({
      success: true,
      message: "Sign up success",
      data: data,
    });
  };

  const login = async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const authResponse = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
        callbackURL: "/",
      },
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    authResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const data = await authResponse.json();

    return res.json({
      success: true,
      message: "Login success",
      data: data,
    });
  };

  const logout = async (req: Request, res: Response) => {
    const authResponse = await auth.api.signOut({
      headers: fromNodeHeaders(req.headers),
      asResponse: true,
    });

    authResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    return res.json({
      success: true,
      message: "Logout success",
    });
  };

  return { signUp, login, logout };
};
