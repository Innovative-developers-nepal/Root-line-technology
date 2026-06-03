import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().default("/api"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3001"),
});

export const env = schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});
