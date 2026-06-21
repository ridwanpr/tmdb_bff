import crypto from "crypto";
import { ResponseError } from "../exceptions/responseError.js";
import type { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { Login, SignUp } from "../schema/auth.schema.js";
import { hashValue, verifyValue } from "../utils/hashing.js";

export type AuthServiceType = {
  registerUser: (data: SignUp) => Promise<Omit<User, "password">>;
  loginUser: (data: Login) => Promise<{ user: Omit<User, "password">; sessionToken: string }>;
};

export const AuthService = (): AuthServiceType => {
  const registerUser = async (data: SignUp) => {
    const hashPassword = await hashValue(data.password);
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword,
      },
      omit: {
        password: true,
      },
    });
  };

  const loginUser = async (data: Login) => {
    const DUMMY_HASH = process.env.ARGON2_DUMMY_HASH!;

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
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

  return { registerUser, loginUser };
};
