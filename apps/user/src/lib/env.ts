import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:5000"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  REVALIDATE_SECRET: z.string().optional(),
  GEO_LAT: z.string().optional(),
  GEO_LNG: z.string().optional(),
  COMPANY_ADDRESS: z.string().optional(),
});

export const env = schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  GEO_LAT: process.env.GEO_LAT,
  GEO_LNG: process.env.GEO_LNG,
  COMPANY_ADDRESS: process.env.COMPANY_ADDRESS,
});
