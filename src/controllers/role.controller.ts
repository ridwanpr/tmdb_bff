import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import type { RoleServiceType } from "../services/role.service.js";

export const RoleController = (roleService: RoleServiceType) => {
  const store = async (req: AuthenticatedRequest, res: Response) => {
    const result = await roleService.createRole(req.body);

    return res.json({
      success: true,
      message: "Create role succeess",
      data: result,
    });
  };

  return { store };
};
