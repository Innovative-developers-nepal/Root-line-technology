import { Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as authService from "../services/auth.service";
import { prisma } from "../config/prisma";

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_BASE = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie("accessToken", accessToken, { ...COOKIE_BASE, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...COOKIE_BASE, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const { user, accessToken, refreshToken } = await authService.registerUser(email, password, firstName, lastName);
    setAuthCookies(res, accessToken, refreshToken);
    sendSuccess(res, 201, { ...user, accessToken });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);
    setAuthCookies(res, accessToken, refreshToken);
    sendSuccess(res, 200, { ...user, accessToken });
});

export const refresh = asyncHandler(async (req, res) => {
    const { refreshToken: currentToken } = req.cookies;
    const { accessToken, refreshToken } = await authService.rotateTokens(currentToken);
    setAuthCookies(res, accessToken, refreshToken);
    sendSuccess(res, 200, { accessToken });
});

export const logout = asyncHandler(async (req: AuthRequest, res) => {
    await authService.logoutUser(req.user!.id);
    res.clearCookie("accessToken", COOKIE_BASE);
    res.clearCookie("refreshToken", COOKIE_BASE);
    sendSuccess(res, 200, { message: "Logged out successfully" });
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res) => {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, 200, user);
});

export const changePassword = asyncHandler(async (req: AuthRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    sendSuccess(res, 200, { message: "Password updated successfully" });
});

export const getRoles = asyncHandler(async (_req, res) => {
    const roles = await prisma.role.findMany({
        where: { name: { not: "SUPER_ADMIN" } },
        select: { id: true, name: true, displayName: true },
        orderBy: { name: "asc" },
    });
    sendSuccess(res, 200, roles);
});
