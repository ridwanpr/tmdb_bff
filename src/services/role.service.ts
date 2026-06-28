import { prisma } from "../lib/prisma.js";
import type { Role } from "../generated/prisma/client.js";
import { ResponseError } from "../exceptions/responseError.js";
import type { CreateRole, DeleteRole, EditRole, RoleParams } from "../schema/role.schema.js";

export type RoleWithUserCount = Role & {
  assigned_user_count: number;
};

export type PaginatedRoles = {
  roles: RoleWithUserCount[];
  meta: {
    currentPage: number;
    itemPerPage: number;
    totalItems: number;
    totalPages: number;
  };
};

export const RoleService = () => {
  const createRole = async (data: CreateRole) => {
    const roleExists = await prisma.role.findUnique({
      where: {
        name: data.name,
      },
    });

    if (roleExists) {
      throw new ResponseError(409, "Role already existed");
    }

    return await prisma.role.create({
      data: data,
    });
  };

  const editRole = async (param: RoleParams, data: EditRole) => {
    const roleExists = await prisma.role.findFirst({
      where: {
        name: data.name,
        id: { not: param.id },
      },
    });

    if (roleExists) {
      throw new ResponseError(409, "Role already existed");
    }

    return await prisma.role.update({
      where: {
        id: param.id,
      },
      data: data,
    });
  };

  const deleteRole = async (param: RoleParams, data: DeleteRole) => {
    if (!data.role_id) {
      const assignedUsersCount = await prisma.userRole.count({
        where: { role_id: param.id },
      });

      if (assignedUsersCount > 0) {
        throw new ResponseError(403, "Role deletion failed because of missing fallback role.");
      }
    }

    return await prisma.$transaction(async (tx) => {
      const isSystemRole = await tx.role.findUnique({
        where: { id: param.id },
      });

      if (isSystemRole?.is_system) {
        throw new ResponseError(403, "System role can't be deleted");
      }

      if (data.role_id) {
        const assignedUser = await tx.userRole.findMany({
          where: { role_id: param.id },
          select: { user_id: true },
        });

        if (assignedUser.length > 0) {
          const mapUserRole = assignedUser.map((user) => ({
            user_id: user.user_id,
            role_id: data.role_id!,
          }));

          await tx.userRole.createMany({
            data: mapUserRole,
          });
        }
      }

      return await tx.role.delete({
        where: { id: param.id },
      });
    });
  };

  const findRole = async (param: RoleParams) => {
    return await prisma.role.findUniqueOrThrow({
      where: {
        id: param.id,
      },
    });
  };

  const listRoles = async (page: number, itemPerPage: number) => {
    const [rolesData, totalItems] = await prisma.$transaction([
      prisma.role.findMany({
        skip: (page - 1) * itemPerPage,
        take: itemPerPage,
        orderBy: {
          id: "asc",
        },
        include: {
          _count: {
            select: {
              userRoles: true,
            },
          },
        },
      }),
      prisma.role.count(),
    ]);

    const totalPages = Math.ceil(totalItems / itemPerPage);

    const roles = rolesData.map((role) => {
      const { _count, ...rest } = role;
      return {
        ...rest,
        assigned_user_count: _count.userRoles,
      };
    });

    return {
      roles,
      meta: {
        currentPage: page,
        itemPerPage,
        totalItems,
        totalPages,
      },
    };
  };

  const roleListOption = async () => {
    return await prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  };

  return { createRole, editRole, deleteRole, findRole, listRoles, roleListOption };
};

export type RoleServiceType = typeof RoleService;
