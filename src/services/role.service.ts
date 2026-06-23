import { prisma } from "../lib/prisma.js";
import type { Role } from "../generated/prisma/client.js";
import { ResponseError } from "../exceptions/responseError.js";
import type { CreateRole, EditRole, RoleParams } from "../schema/role.schema.js";

type PaginatedRoles = {
  roles: Role[];
  meta: {
    currentPage: number;
    itemPerPage: number;
    totalItems: number;
    totalPages: number;
  };
};

export type RoleServiceType = {
  createRole: (data: CreateRole) => Promise<Role>;
  editRole: (param: RoleParams, data: EditRole) => Promise<Role>;
  deleteRole: (param: RoleParams) => Promise<Role>;
  findRole: (param: RoleParams) => Promise<Role>;
  listRoles: (page: number, itemPerPage: number) => Promise<PaginatedRoles>;
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

  const deleteRole = async (param: RoleParams) => {
    const isSystemRole = await prisma.role.findUnique({
      where: {
        id: param.id,
      },
    });

    if (isSystemRole?.is_system) {
      throw new ResponseError(403, "System role can't be deleted");
    }

    return await prisma.role.delete({
      where: {
        id: param.id,
      },
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
    const [roles, totalItems] = await prisma.$transaction([
      prisma.role.findMany({
        skip: (page - 1) * itemPerPage,
        take: itemPerPage,
        orderBy: {
          id: "asc",
        },
      }),
      prisma.role.count(),
    ]);

    const totalPages = Math.ceil(totalItems / itemPerPage);

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

  return { createRole, editRole, deleteRole, findRole, listRoles };
};
