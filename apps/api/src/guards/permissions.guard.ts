import asyncHandler from "../utils/asyncHandler";
import CustomError from "../utils/customError";
import { AuthRequest } from "../middlewares/auth.middleware";
import { hasPermission } from "../services/rbac.service";

export const Permissions = (resource: string, action: string) =>
    asyncHandler(async (req: AuthRequest, _res, next) => {
        const ok = await hasPermission(req.user!.id, resource, action);
        if (!ok) throw new CustomError(403, "Insufficient permissions", "FORBIDDEN");
        next();
    });
