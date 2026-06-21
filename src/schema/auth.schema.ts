import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const signUpSchema = z
  .object({
    name: z.string(),
    email: z.email(),
    password: z.string(),
  })
  .refine(
    async (data) => {
      const user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
      return !user;
    },
    { error: "Email already registered", path: ["email"], abort: true },
  );

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});

export type SignUp = z.infer<typeof signUpSchema>;
export type Login = z.infer<typeof loginSchema>;
