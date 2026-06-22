import { ResponseError } from "../exceptions/responseError.js";
import type { Role } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CreateRole } from "../schema/role.schema.js";

export type RoleServiceType = {
  createRole: (data: CreateRole) => Promise<Role>;
};

export const RoleService = () => {
  const createRole = async (data: CreateRole): Promise<Role> => {
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

  // const editRole = async

  return { createRole };
};
