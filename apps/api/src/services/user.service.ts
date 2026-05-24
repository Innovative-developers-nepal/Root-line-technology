import { prisma } from "../config/prisma";
import { hashPassword } from "../utils/bcrypt";
import CustomError from "../utils/customError";
import { PaginationParams } from "../utils/paginator";

const USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    avatar: true,
    emailVerified: true,
    status: true,
    lastLoginAt: true,
    createdAt: true,
    role: { select: { id: true, name: true, displayName: true } },
};

export async function fetchAllUsers(pagination: PaginationParams) {
    const { cursor, limit, sort, order } = pagination;

    return prisma.user.findMany({
        where: {
            status: { not: "DELETED" },
            role: { name: { not: "SUPER_ADMIN" } },
        },
        take: limit + 1,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { [sort]: order },
        select: USER_SELECT,
    });
}

export async function createNewUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    roleName?: string,
) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new CustomError(409, "User with this email already exists");
    }

    let roleId: string | undefined;
    if (roleName) {
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) throw new CustomError(404, `Role '${roleName}' not found`);
        roleId = role.id;
    }

    const passwordHash = await hashPassword(password);
    return prisma.user.create({
        data: {
            firstName, lastName, email, passwordHash,
            ...(roleId && { roleId }),
        },
        select: USER_SELECT,
    });
}

export async function fetchUserById(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: USER_SELECT,
    });
    if (!user || user.status === "DELETED") {
        throw new CustomError(404, "User not found");
    }
    return user;
}

export async function updateUserById(
    id: string,
    requesterId: string,
    requesterRoleName: string | null,
    data: { firstName?: string; lastName?: string; email?: string; avatar?: string, password?: string }
) {
    const isPrivileged = requesterRoleName === "SUPER_ADMIN" || requesterRoleName === "ADMIN";

    if (requesterId !== id && !isPrivileged) {
        throw new CustomError(403, "You can only update your own profile");
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing || existing.status === "DELETED") {
        throw new CustomError(404, "User not found");
    }

    if (existing.roleId) {
        const targetRole = await prisma.role.findUnique({ where: { id: existing.roleId } });
        if (targetRole?.name === "SUPER_ADMIN" && requesterRoleName !== "SUPER_ADMIN") {
            throw new CustomError(403, "You cannot update a SUPER_ADMIN user");
        }
    }

    const updateData: Record<string, any> = {};
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.password) updateData.passwordHash = await hashPassword(data.password);
    try {
        return await prisma.user.update({ where: { id }, data: updateData, select: USER_SELECT });
    } catch (err: any) {
        if (err.code === "P2002") throw new CustomError(409, "Email is already in use");
        throw err;
    }
}

export async function deleteUserById(id: string, requesterId: string, requesterRoleName: string | null) {
    const isPrivileged = requesterRoleName === "SUPER_ADMIN" || requesterRoleName === "ADMIN";

    if (requesterId !== id && !isPrivileged) {
        throw new CustomError(403, "You can only delete your own account");
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing || existing.status === "DELETED") {
        throw new CustomError(404, "User not found");
    }

    if (existing.roleId) {
        const targetRole = await prisma.role.findUnique({ where: { id: existing.roleId } });
        if (targetRole?.name === "SUPER_ADMIN") {
            throw new CustomError(403, "You cannot delete a SUPER_ADMIN user");
        }
    }

    await prisma.refreshToken.deleteMany({ where: { userID: id } });

    return prisma.user.update({
        where: { id },
        data: { status: "DELETED", deletedAt: new Date() },
        select: { id: true, firstName: true, lastName: true, email: true },
    });
}
