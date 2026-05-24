import asyncHandler from "../utils/asyncHandler";
import CustomError from "../utils/customError";
import { AuthRequest } from "../middlewares/auth.middleware";

export const Roles = (...allowed: string[]) =>
    asyncHandler(async (req: AuthRequest, _res, next) => {
        if (!req.user?.roleName || !allowed.includes(req.user.roleName)) {
            throw new CustomError(403, "Insufficient permissions", "FORBIDDEN");
        }
        next();
    });
