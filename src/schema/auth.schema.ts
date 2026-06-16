import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().nonempty(),
});

export type SignUp = z.infer<typeof signUpSchema>;
export type Login = z.infer<typeof loginSchema>;
