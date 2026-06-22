import z from "zod";
import { prisma } from "../lib/prisma.js";

export const createRoleSchema = z
  .object({
    name: z.string().min(2).max(255),
    description: z.string().nullable(),
  })
  .refine(async (data) => {
    const roleExists = await prisma.role.findUnique({
      where: {
        name: data.name,
      },
    });
    return !roleExists;
  });

export const editRoleSchema = z
  .object({
    id: z.string(),
    name: z.string().min(2).max(255),
    description: z.string().nullable(),
  })
  .refine(
    async (data) => {
      const roleExists = await prisma.role.findFirst({
        where: {
          name: data.name,
          id: { not: data.id },
        },
      });
      return !roleExists;
    },
    {
      message: "Role name already exists",
      path: ["name"],
    },
  );

export type CreateRole = z.infer<typeof createRoleSchema>;
export type EditRole = z.infer<typeof editRoleSchema>;
