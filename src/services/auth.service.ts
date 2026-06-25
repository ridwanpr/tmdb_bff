import crypto from "crypto";
import { ResponseError } from "../exceptions/responseError.js";
import { prisma } from "../lib/prisma.js";
import type { Login, SignUp } from "../schema/auth.schema.js";
import { hashValue, verifyValue } from "../utils/hashing.js";

export type FlatUserSession = {
  session_token: string;
  expires_at: Date;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
};

export const AuthService = () => {
  const registerUser = async (data: SignUp) => {
    const isUserExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (isUserExists) {
      throw new ResponseError(409, "Email already registered");
    }

    const hashPassword = await hashValue(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
      },
      omit: {
        password: true,
      },
    });

    const userRole = await prisma.role.findFirstOrThrow({
      where: {
        name: "User",
      },
    });

    await prisma.userRole.create({
      data: {
        role_id: userRole.id,
        user_id: user.id,
      },
    });

    return user;
  };

  const loginUser = async (data: Login) => {
    const DUMMY_HASH =
      "$argon2id$v=19$m=19456,t=2,p=1$YkNPVlVCRFU0aUlkdnNucQ$EmeawRu874p4GbX6T0ev+A";

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    const hashToVerify = user ? user.password : DUMMY_HASH;

    const verifyPassword = await verifyValue(hashToVerify, data.password);

    if (!user || !verifyPassword) {
      throw new ResponseError(401, "Invalid email or password");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    const token = crypto.randomBytes(32).toString("hex");
    const sessionExpiry = new Date();
    sessionExpiry.setDate(sessionExpiry.getDate() + 14);

    const session = await prisma.session.create({
      data: {
        session_token: token,
        user_id: user.id,
        expires_at: sessionExpiry,
      },
    });

    return {
      user: userWithoutPassword,
      sessionToken: session.session_token,
    };
  };

  const logoutUser = async (token: string | undefined) => {
    if (!token) return;

    await prisma.session.deleteMany({
      where: { session_token: token },
    });
  };

  const getCurrentUser = async (
    userId: string,
    sessionToken: string,
  ): Promise<FlatUserSession | null> => {
    const session = await prisma.session.findFirst({
      where: {
        user_id: userId,
        session_token: sessionToken,
      },
      include: {
        user: {
          omit: {
            password: true,
            created_at: true,
            updated_at: true,
          },
          include: {
            userRoles: {
              include: {
                role: {
                  omit: {
                    created_at: true,
                    updated_at: true,
                  },
                  include: {
                    rolePermissions: {
                      include: {
                        permission: {
                          omit: {
                            created_at: true,
                            updated_at: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    const roles = session.user.userRoles.map((ur) => ur.role.name);

    const permissions = session.user.userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => rp.permission.name),
    );

    const uniquePermissions = [...new Set(permissions)];

    return {
      session_token: session.session_token,
      expires_at: session.expires_at,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        roles: roles,
        permissions: uniquePermissions,
      },
    };
  };

  return { registerUser, loginUser, logoutUser, getCurrentUser };
};

export type AuthServiceType = typeof AuthService;
