import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import { decode } from "../utils/token";

const rateLimitResponse = {
    success: false,
    error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please try again later.",
        details: [],
    },
};

const makeLimit = (max: number) =>
    rateLimit({
        windowMs: 60_000,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req: Request) => {
            // key by user ID when authenticated, fall back to IP
            const ipKey = ipKeyGenerator(req.ip ?? "unknown");
            return (req as any).__rateLimitUserId ?? ipKey;
        },
        handler: (_req: Request, res: Response) => {
            res.status(429).json(rateLimitResponse);
        },
    });

const limiters = {
    STARTER: makeLimit(100),
    PROFESSIONAL: makeLimit(500),
    ENTERPRISE: makeLimit(2000),
};

type Plan = keyof typeof limiters;

export const dynamicRateLimiter = (req: Request, res: Response, next: NextFunction) => {
    let plan: Plan = "STARTER";

    try {
        const token = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : (req as any).cookies?.accessToken;

        if (token) {
            const decoded = decode(token);
            const userPlan = (decoded.plan as Plan) ?? "STARTER";
            if (userPlan in limiters) plan = userPlan;
            (req as any).__rateLimitUserId = String(decoded.id);
            // attach decoded payload so authenticateToken can reuse it without a second decode
            (req as any).__decodedToken = decoded;
        }
    } catch {
        // invalid/expired token — treat as unauthenticated, STARTER limits apply
    }

    return limiters[plan](req, res, next);
};
