import { z } from "zod";

export const applicationFormSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 6, "Phone too short"),
  coverNote: z.string().optional(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
