import type { Request, Response } from "express";

export const AuthController = () => {
  const signUp = async (req: Request, res: Response) => {
    return res.json({
      success: true,
      message: "Sign up success",
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
