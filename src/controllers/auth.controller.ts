import type { Request, Response } from "express";
import type { AuthServiceType } from "../services/auth.service.js";
import { loginSchema, signUpSchema } from "../schema/auth.schema.js";

export const AuthController = (authService: AuthServiceType) => {
  const signUp = async (req: Request, res: Response) => {
    const body = signUpSchema.parse(req.body);
    const result = await authService.registerUser(body);

    return res.json({
      success: true,
      message: "Sign up success, now you can login",
      data: result,
    });
  };

  const login = async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);
    const result = await authService.loginUser(body);

    res.cookie("session_token", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    return res.json({
      success: true,
      message: "Login success",
      data: result.user,
    });
  };

  const logout = async (req: Request, res: Response) => {
    const token = req.cookies?.session_token;
    await authService.logoutUser(token);

    res.clearCookie("session_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Logout success",
    });
  };

  return { signUp, login, logout };
};
