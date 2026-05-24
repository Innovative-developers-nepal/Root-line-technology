import { z } from "zod";

const tiptapJson = z.record(z.string(), z.any());

export const JOB_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"] as const;

export const jobFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().min(1, "Required"),
  department: z.string().optional(),
  location: z.string().min(1, "Required"),
  type: z.enum(JOB_TYPES).default("FULL_TIME"),
  body: tiptapJson,
  salaryRange: z.string().optional(),
  isOpen: z.boolean().default(true),
});

export type JobFormValues = z.infer<typeof jobFormSchema>;
