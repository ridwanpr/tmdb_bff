import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { assignPermissionSchema, rolePermissionParamSchema } from "../schema/permission.schema.js";
import type { PermissionServiceType } from "../services/permission.service.js";

export const PermissionController = (permissionService: ReturnType<PermissionServiceType>) => {
  const update = async (req: AuthenticatedRequest, res: Response) => {
    const body = assignPermissionSchema.parse(req.body);
    const result = await permissionService.assignPermissionToRole(body);

    return res.json({
      success: true,
      message: "Update role permission success",
      data: result,
    });
  };

  const show = async (req: AuthenticatedRequest, res: Response) => {
    const params = rolePermissionParamSchema.parse(req.params);
    const result = await permissionService.getRolePermission(params);

    return res.json({
      success: true,
      message: "Get role permission success",
      data: result,
    });
  };

  const permissionOption = async (req: AuthenticatedRequest, res: Response) => {
    const result = await permissionService.getRolePermissionOption();

    return res.json({
      success: true,
      message: "Get permission option success",
      data: result,
    });
  };

  return { update, show, permissionOption };
};
