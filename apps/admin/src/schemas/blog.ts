import { z } from "zod";

const tiptapJson = z.record(z.string(), z.any());

export const blogFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, hyphens only"),
  title: z.string().min(1, "Required"),
  excerpt: z.string().min(1, "Required"),
  content: tiptapJson,
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  category: z.string().min(1, "Required"),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1, "Required"),
  readTime: z.string().min(1, "Required"),
  published: z.boolean().default(false),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
