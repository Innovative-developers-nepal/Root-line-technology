import { z } from "zod";

export const teamFormSchema = z.object({
  name: z.string().min(1, "Required"),
  role: z.string().min(1, "Required"),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      github: z.string().url().optional().or(z.literal("")),
      website: z.string().url().optional().or(z.literal("")),
    })
    .partial()
    .optional(),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
