import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as appService from "../services/application.service";
import { buildPaginationMeta } from "../utils/paginator";
import httpStatus from "http-status";

export const createApplication = asyncHandler(async (req, res) => {
    const item = await appService.createApplication(req.body);
    sendSuccess(res, httpStatus.CREATED, item);
});

export const adminGetApplications = asyncHandler(async (req: AuthRequest, res) => {
    const result = await appService.getApplications(req.query as any);
    const meta   = buildPaginationMeta(result.applications, Number(req.query.limit) || 20);
    sendSuccess(res, httpStatus.OK, result.applications, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const adminGetApplicationById = asyncHandler(async (req: AuthRequest, res) => {
    const item = await appService.getApplicationById(req.params.id as string);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminUpdateApplicationStatus = asyncHandler(async (req: AuthRequest, res) => {
    const item = await appService.updateApplicationStatus(req.params.id as string, req.body);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminDeleteApplication = asyncHandler(async (req: AuthRequest, res) => {
    await appService.deleteApplication(req.params.id as string);
    sendSuccess(res, httpStatus.OK, null);
});
