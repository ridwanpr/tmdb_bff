import z from "zod";

export const assignPermissionSchema = z.object({
  role_id: z.uuid(),
  permission_id: z.uuid(),
});

export type AssignPermission = z.infer<typeof assignPermissionSchema>;
