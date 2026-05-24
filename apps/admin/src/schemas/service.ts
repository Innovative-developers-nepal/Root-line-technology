import { z } from "zod";

const tiptapJson = z.record(z.string(), z.any());

export const serviceFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().min(1, "Required"),
  summary: z.string().min(1, "Required"),
  body: tiptapJson,
  iconKey: z.string().optional(),
  order: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;
