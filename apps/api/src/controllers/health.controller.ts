import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { prisma } from "../config/prisma";

export const livenessCheck = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
        uptime: Math.floor(process.uptime()),
        env: process.env.NODE_ENV ?? "development",
    });
});

export const readinessCheck = asyncHandler(async (_req: Request, res: Response) => {
    const checks: Record<string, boolean> = { db: false };

    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.db = true;
    } catch {}

    const ready = Object.values(checks).every(Boolean);
    res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "degraded", checks });
});
