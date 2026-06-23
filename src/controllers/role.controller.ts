import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import type { RoleServiceType } from "../services/role.service.js";
import {
  createRoleSchema,
  editRoleSchema,
  rolePaginateSchema,
  roleParamsSchema,
} from "../schema/role.schema.js";

export const RoleController = (roleService: RoleServiceType) => {
  const store = async (req: AuthenticatedRequest, res: Response) => {
    const body = createRoleSchema.parse(req.body);
    const result = await roleService.createRole(body);

    return res.json({
      success: true,
      message: "Create role success",
      data: result,
    });
  };

  const update = async (req: AuthenticatedRequest, res: Response) => {
    const params = roleParamsSchema.parse(req.params);
    const body = editRoleSchema.parse(req.body);

    const result = await roleService.editRole(params, body);

    return res.json({
      success: true,
      message: "Update role success",
      data: result,
    });
  };

  const destroy = async (req: AuthenticatedRequest, res: Response) => {
    const params = roleParamsSchema.parse(req.params);
    await roleService.deleteRole(params);

    return res.json({
      success: true,
      message: "Delete role success",
    });
  };

  const show = async (req: AuthenticatedRequest, res: Response) => {
    const params = roleParamsSchema.parse(req.params);
    const result = await roleService.findRole(params);

    return res.json({
      success: true,
      message: "Find role success",
      data: result,
    });
  };

  const index = async (req: AuthenticatedRequest, res: Response) => {
    const query = rolePaginateSchema.parse(req.params);

    const { roles, meta } = await roleService.listRoles(query.page ?? 1, query.itemPerPage ?? 15);

    return res.json({
      success: true,
      message: "Get list role success",
      data: roles,
      meta: meta,
    });
  };

  return { store, update, destroy, show, index };
};
