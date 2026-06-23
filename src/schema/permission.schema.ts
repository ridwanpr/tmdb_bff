import z from "zod";

export const assignPermissionSchema = z.object({
  role_id: z.uuid(),
  permission_id: z.array(z.uuid()),
});

export const rolePermissionParamSchema = z.object({
  role_id: z.uuid(),
});

export type AssignPermission = z.infer<typeof assignPermissionSchema>;
export type RolePermissionParams = z.infer<typeof rolePermissionParamSchema>;
