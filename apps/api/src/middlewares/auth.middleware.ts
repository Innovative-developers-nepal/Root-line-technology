import { Request, Response, NextFunction } from "express";
import { decode } from "../utils/token";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        roleName: string | null;
    };
}

export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : req.cookies?.accessToken;
        if (!token) return next();
        const decoded = (req as any).__decodedToken ?? decode(token);
        req.user = {
            id:        decoded.id as string,
            email:     decoded.email as string,
            firstName: decoded.firstName as string,
            lastName:  decoded.lastName as string,
            roleName:  (decoded.roleName as string) ?? null,
        };
        next();
    } catch {
        next();
    }
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: { code: "UNAUTHORIZED", message: "Access token not found", details: [] },
            });
        }

        const decoded = (req as any).__decodedToken ?? decode(token);

        req.user = {
            id:        decoded.id as string,
            email:     decoded.email as string,
            firstName: decoded.firstName as string,
            lastName:  decoded.lastName as string,
            roleName:  (decoded.roleName as string) ?? null,
        };

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                error: { code: "TOKEN_EXPIRED", message: "Token expired", details: [] },
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                error: { code: "INVALID_TOKEN", message: "Invalid token", details: [] },
            });
        }
        next(error);
    }
};
