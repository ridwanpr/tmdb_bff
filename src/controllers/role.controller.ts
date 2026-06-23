import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import type { RoleServiceType } from "../services/role.service.js";
import type { DeleteRoleRequest, EditRoleRequest } from "../schema/role.schema.js";

export const RoleController = (roleService: RoleServiceType) => {
  const store = async (req: AuthenticatedRequest, res: Response) => {
    const result = await roleService.createRole(req.body);

    return res.json({
      success: true,
      message: "Create role succeess",
      data: result,
    });
  };

  const update = async (req: EditRoleRequest, res: Response) => {
    const result = await roleService.editRole(req.params, req.body);

    return res.json({
      success: true,
      message: "Update role succeess",
      data: result,
    });
  };

  const destroy = async (req: DeleteRoleRequest, res: Response) => {
    await roleService.deleteRole(req.params);

    return res.json({
      success: true,
      message: "Delete role succeess",
    });
  };

  return { store, update, destroy };
};
