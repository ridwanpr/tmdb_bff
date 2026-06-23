import { prisma } from "../lib/prisma.js";
import { ResponseError } from "../exceptions/responseError.js";
import type { AssignPermission } from "../schema/permission.schema.js";
import type { RolePermission } from "../generated/prisma/client.js";

export type PermissionServiceType = {
  assignPermissionToRole: (data: AssignPermission[]) => Promise<RolePermission[]>;
};

export const PermissionService = (): PermissionServiceType => {
  const assignPermissionToRole = async (data: AssignPermission[]) => {
    const uniqueRoleIds = [...new Set(data.map((item) => item.role_id))];
    const uniquePermissionIds = [...new Set(data.map((item) => item.permission_id))];

    const rolesExistCount = await prisma.role.count({
      where: { id: { in: uniqueRoleIds } },
    });

    if (rolesExistCount !== uniqueRoleIds.length) {
      throw new ResponseError(400, "One or more provided role_ids do not exist.");
    }

    const permissionsExistCount = await prisma.permission.count({
      where: { id: { in: uniquePermissionIds } },
    });

    if (permissionsExistCount !== uniquePermissionIds.length) {
      throw new ResponseError(400, "One or more provided permission_ids do not exist.");
    }

    return await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: {
          role_id: { in: uniqueRoleIds },
        },
      });

      if (data.length > 0) {
        await tx.rolePermission.createMany({
          data: data,
          skipDuplicates: true,
        });
      }

      return await tx.rolePermission.findMany({
        where: { role_id: { in: uniqueRoleIds } },
      });
    });
  };

  return { assignPermissionToRole };
};
