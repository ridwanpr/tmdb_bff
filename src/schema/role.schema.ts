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

export const rolePaginateSchema = z.object({
  page: z.coerce.number().min(1).max(255).nullish(),
  itemPerPage: z.coerce.number().min(1).max(255).nullish(),
});

export const deleteRoleSchema = z.object({
  role_id: z.uuid().nullish(),
});

export type CreateRole = z.infer<typeof createRoleSchema>;
export type EditRole = z.infer<typeof editRoleSchema>;
export type RoleParams = z.infer<typeof roleParamsSchema>;
export type DeleteRole = z.infer<typeof deleteRoleSchema>;
