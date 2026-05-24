import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('3001'),

    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    CORS_ORIGIN: z.string().optional(),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    JWT_PRIVATE_KEY: z.string().min(1, 'JWT_PRIVATE_KEY is required'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('15m'),

    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.string().url(),

    FRONTEND_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);