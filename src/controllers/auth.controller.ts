import type { Request, Response } from "express";
import type { AuthServiceType } from "../services/auth.service.js";

export const AuthController = (authService: AuthServiceType) => {
  const signUp = async (req: Request, res: Response) => {
    const result = await authService.registerUser(req.body);

    return res.json({
      success: true,
      message: "Sign up success",
      data: result,
    });
  };

  const login = async (req: Request, res: Response) => {
    return res.json({
      success: true,
      message: "Login success",
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
