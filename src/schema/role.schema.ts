import z from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().nullable(),
});

export const editRoleSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().nullable(),
});

export const roleParamsSchema = z.object({
  id: z.uuid(),
});

export type CreateRole = z.infer<typeof createRoleSchema>;
export type EditRole = z.infer<typeof editRoleSchema> & z.infer<typeof roleParamsSchema>;
