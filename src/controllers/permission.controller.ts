import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { assignPermissionSchema } from "../schema/permission.schema.js";
import z from "zod";
import type { PermissionServiceType } from "../services/permission.service.js";

export const PermissionController = (permissionService: PermissionServiceType) => {
  const update = async (req: AuthenticatedRequest, res: Response) => {
    const body = z.array(assignPermissionSchema).parse(req.body);
    const result = await permissionService.assignPermissionToRole(body);

    return res.json({
      success: true,
      message: "Update role permission success",
      data: result,
    });
  };

  return { update };
};
