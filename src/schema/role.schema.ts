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

export type CreateRole = z.infer<typeof createRoleSchema>;
