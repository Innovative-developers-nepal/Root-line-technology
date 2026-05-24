import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
