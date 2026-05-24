import { env } from "../schemas/config.schema";

const parseCorsOrigins = (value?: string): string[] | boolean => {
    if (!value) return true;
    if (value === '*') return true;

    return value.split(',').map((o) => o.trim());
};

export const config = {
    port: Number(env.PORT),

    nodeEnv: env.NODE_ENV,

    corsOrigin: parseCorsOrigins(env.CORS_ORIGIN),

    database: {
        url: env.DATABASE_URL,
    },

    jwt: {
        privateKey: env.JWT_PRIVATE_KEY,
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
    },

    google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        redirectUri: env.GOOGLE_REDIRECT_URI,
    },

    frontend: {
        url: env.FRONTEND_URL,
    },

} as const;