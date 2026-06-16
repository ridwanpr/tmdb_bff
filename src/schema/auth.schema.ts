import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export type SignUp = z.infer<typeof signUpSchema>;
