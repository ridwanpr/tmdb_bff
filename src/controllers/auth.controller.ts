import type { Request, Response } from "express";
import type { AuthServiceType } from "../services/auth.service.js";

export const AuthController = (authService: AuthServiceType) => {
  const signUp = async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body);

    return res.json({
      success: true,
      message: "Sign up success, now you can login",
      data: result,
    });
  };

  const login = async (req: Request, res: Response) => {
    const result = await authService.loginUser(req.body);

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
    return res.json({
      success: true,
      message: "Logout success",
    });
  };

  return { signUp, login, logout };
};
