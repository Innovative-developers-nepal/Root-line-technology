import { prisma } from "./prisma";

type BetterAuthInstance = any;

let _auth: BetterAuthInstance | null = null;

export async function getAuth(): Promise<BetterAuthInstance> {
    if (_auth) return _auth;

    // @ts-expect-error - better-auth not installed as dependency; loaded at runtime
    const { betterAuth } = await import("better-auth").catch(() => {
        throw new Error(
            "better-auth not installed. Run: pnpm -F @rootline/api add better-auth",
        );
    });
    // @ts-expect-error - better-auth not installed as dependency; loaded at runtime
    const { prismaAdapter } = await import("better-auth/adapters/prisma");

    _auth = betterAuth({
        database: prismaAdapter(prisma, { provider: "sqlite" }),
        emailAndPassword: { enabled: true, autoSignIn: false },
        socialProviders: process.env.GOOGLE_CLIENT_ID
            ? {
                google: {
                    clientId:     process.env.GOOGLE_CLIENT_ID!,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                },
            }
            : undefined,
        session: {
            expiresIn: 60 * 60 * 24 * 30,
            updateAge: 60 * 60 * 24,
            cookieCache: { enabled: true, maxAge: 60 * 5 },
        },
        advanced: {
            cookiePrefix: "rootline",
        },
        trustedOrigins: (process.env.CORS_ORIGIN ?? "")
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
    });

    return _auth;
}
