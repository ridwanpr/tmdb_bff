import { ResponseError } from "../exceptions/responseError.js";
import type { Role } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CreateRole, EditRole, RoleParams } from "../schema/role.schema.js";

export type RoleServiceType = {
  createRole: (data: CreateRole) => Promise<Role>;
  editRole: (param: RoleParams, data: EditRole) => Promise<Role>;
  deleteRole: (param: RoleParams) => Promise<Role>;
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

  return { createRole, editRole, deleteRole };
};
