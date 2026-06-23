import { ResponseError } from "../exceptions/responseError.js";
import type { Role } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CreateRole, EditRole, EditRoleParams } from "../schema/role.schema.js";

export type RoleServiceType = {
  createRole: (data: CreateRole) => Promise<Role>;
  editRole: (id: EditRoleParams, data: EditRole) => Promise<Role>;
  deleteRole: (id: string) => Promise<Role>;
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

  const editRole = async (param: EditRoleParams, data: EditRole) => {
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

  const deleteRole = async (id: string) => {
    return await prisma.role.delete({
      where: {
        id: id,
      },
    });
  };

  return { createRole, editRole, deleteRole };
};
