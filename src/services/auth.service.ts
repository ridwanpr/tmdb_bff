import type { User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { SignUp } from "../schema/auth.schema.js";
import { hashValue } from "../utils/hashing.js";

export type AuthServiceType = {
  registerUser: (data: SignUp) => Promise<User>;
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
    });
  };

  return { registerUser };
};
