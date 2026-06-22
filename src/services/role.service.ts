import { ResponseError } from "../exceptions/responseError.js";
import type { Role } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CreateRole, EditRole } from "../schema/role.schema.js";

export type RoleServiceType = {
  createRole: (data: CreateRole) => Promise<Role>;
  editRole: (data: EditRole) => Promise<Role>;
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

  const editRole = async (data: EditRole) => {
    console.log(data);
    const roleExists = await prisma.role.findFirst({
      where: {
        name: data.name,
        id: { not: data.id },
      },
    });

    if (roleExists) {
      throw new ResponseError(409, "Role already existed");
    }

    return await prisma.role.update({
      where: {
        id: data.id,
      },
      data: data,
    });
  };

  return { createRole, editRole };
};
