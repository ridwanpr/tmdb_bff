import { prisma } from "../src/lib/prisma.js";
import { hashValue } from "../src/utils/hashing.js";

async function main() {
  const defaultRoles = [
    { name: "Super Admin", description: "Super Admin role" },
    { name: "Admin", description: "Admin role" },
    { name: "User", description: "User role" },
  ];

  const defaultPermissions = [
    // User Management
    {
      slug: "user:create",
      name: "Create User",
      description: "Allows creating new user accounts within the system.",
    },
    {
      slug: "user:edit",
      name: "Edit User",
      description: "Allows modifying existing user profile and account details.",
    },
    {
      slug: "user:delete",
      name: "Delete User",
      description: "Allows permanently removing user accounts from the system.",
    },
    {
      slug: "user:show",
      name: "View User Details",
      description: "Allows viewing profile details of a specific user.",
    },
    {
      slug: "user:list",
      name: "List Users",
      description: "Allows viewing and filtering the complete list of users.",
    },

    // Role Management
    {
      slug: "role:create",
      name: "Create Role",
      description: "Allows creating new roles for access control.",
    },
    {
      slug: "role:edit",
      name: "Edit Role",
      description:
        "Allows modifying role names, descriptions, and updating their associated permissions.",
    },
    {
      slug: "role:delete",
      name: "Delete Role",
      description: "Allows permanently removing roles from the system.",
    },
    {
      slug: "role:show",
      name: "View Role Details",
      description: "Allows viewing specific role configurations and assigned permissions.",
    },
    {
      slug: "role:list",
      name: "List Roles",
      description: "Allows viewing the complete list of available roles.",
    },

    // Permission Management
    {
      slug: "permission:create",
      name: "Create Permission",
      description: "Allows defining new system-wide permissions.",
    },
    {
      slug: "permission:edit",
      name: "Edit Permission",
      description: "Allows modifying permission metadata such as names and descriptions.",
    },
    {
      slug: "permission:delete",
      name: "Delete Permission",
      description: "Allows permanently removing permissions from the system registry.",
    },
    {
      slug: "permission:show",
      name: "View Permission Details",
      description: "Allows viewing detailed information of a specific permission.",
    },
    {
      slug: "permission:list",
      name: "List Permissions",
      description: "Allows viewing the complete registry of system permissions.",
    },
  ];

  await prisma.role.createMany({
    data: defaultRoles,
    skipDuplicates: true,
  });

  await prisma.permission.createMany({
    data: defaultPermissions,
    skipDuplicates: true,
  });

  const roles = await prisma.role.findMany();
  const permissions = await prisma.permission.findMany();

  const superAdminRole = roles.find((r) => r.name === "Super Admin");
  const adminRole = roles.find((r) => r.name === "Admin");
  const userRole = roles.find((r) => r.name === "User");

  const rolePermissionsData: { role_id: string; permission_id: string }[] = [];

  if (superAdminRole) {
    permissions.forEach((perm) => {
      rolePermissionsData.push({
        role_id: superAdminRole.id,
        permission_id: perm.id,
      });
    });
  }

  if (adminRole) {
    permissions.forEach((perm) => {
      if (!perm.slug.startsWith("permission:")) {
        rolePermissionsData.push({
          role_id: adminRole.id,
          permission_id: perm.id,
        });
      }
    });
  }

  await prisma.rolePermission.createMany({
    data: rolePermissionsData,
    skipDuplicates: true,
  });

  const defaultUsers = [
    {
      name: "Super Admin",
      email: "super@local.app",
      password: "@SupLocS3rvr*#",
      roleId: superAdminRole!.id,
    },
    {
      name: "Admin User",
      email: "admin@local.app",
      password: "@AdmLocS3rvr*#",
      roleId: adminRole!.id,
    },
    {
      name: "Regular User",
      email: "user@local.app",
      password: "user@123*#",
      roleId: userRole!.id,
    },
  ];

  for (const userData of defaultUsers) {
    if (!userData.roleId) continue;

    const hashedPassword = await hashValue(userData.password);

    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        userRoles: {
          create: {
            role_id: userData.roleId,
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
