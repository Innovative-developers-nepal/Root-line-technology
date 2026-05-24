import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken, generateRefreshToken } from "../utils/token";
import CustomError from "../utils/customError";
import { logger } from "../utils/logger";
import { invalidatePermissionCache } from "./rbac.service";

export type IPayload = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleName: string | null;
};

const refreshTokenExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new CustomError(409, "User with this email already exists");
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
        data: { email, passwordHash, firstName, lastName },
        select: {
            id: true, email: true, firstName: true, lastName: true,
            avatar: true, emailVerified: true, status: true,
            createdAt: true,
            role: { select: { name: true } },
        },
    });

    const payload: IPayload = {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        roleName: user.role?.name ?? null,
    };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
        data: { token: refreshToken, userID: user.id, expiresAt: refreshTokenExpiry() },
    });

    return { user, accessToken, refreshToken };
}

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true, email: true, firstName: true, lastName: true,
            avatar: true, emailVerified: true, status: true,
            lastLoginAt: true, createdAt: true,
            passwordHash: true,
            role: { select: { name: true } },
        },
    });
    if (!user) {
        throw new CustomError(401, "Invalid email or password");
    }

    if (!user.passwordHash) {
        throw new CustomError(401, "This account uses a different sign-in method");
    }

    if (user.status !== "ACTIVE") {
        throw new CustomError(403, "Account is not active", "ACCOUNT_INACTIVE");
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
        throw new CustomError(401, "Invalid email or password");
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    await prisma.refreshToken.deleteMany({
        where: {
            userID: user.id,
            OR: [{ isBlacklisted: true }, { expiresAt: { lt: new Date() } }],
        },
    });

    const payload: IPayload = {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        roleName: user.role?.name ?? null,
    };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
        data: { token: refreshToken, userID: user.id, expiresAt: refreshTokenExpiry() },
    });

    const { passwordHash: _, ...safe } = user;
    return { user: safe, accessToken, refreshToken };
}

export async function rotateTokens(currentRefreshToken: string) {
    if (!currentRefreshToken) {
        throw new CustomError(401, "No refresh token provided");
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: currentRefreshToken } });
    if (!stored) {
        throw new CustomError(403, "Invalid refresh token");
    }

    if (stored.isBlacklisted) {
        await prisma.refreshToken.deleteMany({ where: { userID: stored.userID } });
        throw new CustomError(401, "Session expired, please log in again", "TOKEN_REUSE_DETECTED");
    }

    if (stored.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { token: currentRefreshToken } });
        throw new CustomError(403, "Refresh token expired");
    }

    const user = await prisma.user.findUnique({
        where: { id: stored.userID },
        select: {
            id: true, email: true, firstName: true, lastName: true,
            status: true,
            role: { select: { name: true } },
        },
    });
    if (!user) {
        throw new CustomError(404, "User not found");
    }

    if (user.status !== "ACTIVE") {
        throw new CustomError(403, "Account is not active", "ACCOUNT_INACTIVE");
    }

    const payload: IPayload = {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        roleName: user.role?.name ?? null,
    };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken();

    await prisma.$transaction([
        prisma.refreshToken.update({ where: { token: currentRefreshToken }, data: { isBlacklisted: true } }),
        prisma.refreshToken.create({ data: { token: refreshToken, userID: user.id, expiresAt: refreshTokenExpiry() } }),
    ]);

    return { accessToken, refreshToken };
}

export async function logoutUser(userId: string) {
    await invalidatePermissionCache(userId);
    await prisma.refreshToken.deleteMany({ where: { userID: userId } }).catch((err) => {
        logger.warn(`Failed to delete refresh tokens for user ${userId}: ${err.message}`);
    });
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, passwordHash: true },
    });
    if (!user || !user.passwordHash) {
        throw new CustomError(400, "Password change not available for this account");
    }

    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
        throw new CustomError(401, "Current password is incorrect");
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.$transaction([
        prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
        prisma.refreshToken.deleteMany({ where: { userID: userId } }),
    ]);
}

export async function getMe(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
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
        },
    });

    if (!user) {
        throw new CustomError(404, "User not found");
    }

    return user;
}
