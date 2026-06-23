import { prisma } from "../lib/prisma.js";
import { ResponseError } from "../exceptions/responseError.js";
import type { AssignPermission, RolePermissionParams } from "../schema/permission.schema.js";
import type { Prisma, RolePermission } from "../generated/prisma/client.js";

export type RoleWithPermissions = Prisma.RoleGetPayload<{
  include: {
    rolePermissions: {
      include: {
        permission: true;
      };
    };
  };
}>;

export type PermissionServiceType = {
  assignPermissionToRole: (data: AssignPermission) => Promise<RolePermission[]>;
  getRolePermission: (params: RolePermissionParams) => Promise<RoleWithPermissions | null>;
};

export const PermissionService = (): PermissionServiceType => {
  const assignPermissionToRole = async (data: AssignPermission) => {
    const { role_id, permission_id } = data;

    const uniquePermissionIds = [...new Set(permission_id)];

    const roleExists = await prisma.role.count({
      where: { id: role_id },
    });

    if (roleExists !== 1) {
      throw new ResponseError(400, "The provided role_id does not exist.");
    }

    if (uniquePermissionIds.length > 0) {
      const permissionsExistCount = await prisma.permission.count({
        where: { id: { in: uniquePermissionIds } },
      });

      if (permissionsExistCount !== uniquePermissionIds.length) {
        throw new ResponseError(400, "One or more provided permission_ids do not exist.");
      }
    }

    return await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: { role_id },
      });

      if (uniquePermissionIds.length > 0) {
        const recordsToInsert = uniquePermissionIds.map((permId) => ({
          role_id: role_id,
          permission_id: permId,
        }));

        await tx.rolePermission.createMany({
          data: recordsToInsert,
          skipDuplicates: true,
        });
      }

      return await tx.rolePermission.findMany({
        where: { role_id },
      });
    });
  };

  const getRolePermission = async (params: RolePermissionParams) => {
    const rolePermission = await prisma.role.findUnique({
      where: {
        id: params.role_id,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return rolePermission;
  };

  return { assignPermissionToRole, getRolePermission };
};
