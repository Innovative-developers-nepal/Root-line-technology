import { prisma } from "../config/prisma";
import CustomError from "../utils/customError";

export async function hasPermission(
    userId: string,
    resource: string,
    action: string
): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId, status: "ACTIVE" },
        select: { role: { select: { id: true, hierarchy: true } } },
    });
    if (!user?.role) return false;

    if (user.role.hierarchy === 1) return true;

    const permission = await prisma.permission.findUnique({
        where: { resource_action: { resource, action } },
    });
    if (!permission) throw new CustomError(500, `Permission not configured in DB: ${resource}:${action}`, "PERMISSION_NOT_CONFIGURED");

    const granted = await prisma.rolePermission.findFirst({
        where: { permissionId: permission.id, roleId: user.role.id },
    });

    return !!granted;
}

export async function invalidatePermissionCache(userId: string): Promise<void> {
    // No-op without Redis; permissions are queried fresh each time
}
