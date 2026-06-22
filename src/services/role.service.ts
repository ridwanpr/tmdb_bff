import type { Role } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CreateRole } from "../schema/role.schema.js";

export type RoleServiceType = {
  createRole: (data: CreateRole) => Promise<Role>;
};

export const RoleService = () => {
  const createRole = async (data: CreateRole): Promise<Role> => {
    return await prisma.role.create({
      data: data,
    });
  };

  return { createRole };
};
