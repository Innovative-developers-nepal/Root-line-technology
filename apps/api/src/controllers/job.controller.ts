import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as jobService from "../services/job.service";
import { buildPaginationMeta } from "../utils/paginator";
import httpStatus from "http-status";

export const getJobs = asyncHandler(async (req, res) => {
    const result = await jobService.getJobs(req.query as any);
    const meta   = buildPaginationMeta(result.jobs, Number(req.query.limit) || 20);
    sendSuccess(res, httpStatus.OK, result.jobs, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const getJobBySlug = asyncHandler(async (req, res) => {
    const item = await jobService.getJobBySlug(req.params.slug as string);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminGetJobs = asyncHandler(async (req: AuthRequest, res) => {
    const result = await jobService.getJobs(req.query as any, true);
    const meta   = buildPaginationMeta(result.jobs, Number(req.query.limit) || 20);
    sendSuccess(res, httpStatus.OK, result.jobs, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const adminGetJobById = asyncHandler(async (req: AuthRequest, res) => {
    const item = await jobService.getJobById(req.params.id as string);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminCreateJob = asyncHandler(async (req: AuthRequest, res) => {
    const item = await jobService.createJob(req.body);
    sendSuccess(res, httpStatus.CREATED, item);
});

export const adminUpdateJob = asyncHandler(async (req: AuthRequest, res) => {
    const item = await jobService.updateJob(req.params.id as string, req.body);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminDeleteJob = asyncHandler(async (req: AuthRequest, res) => {
    await jobService.deleteJob(req.params.id as string);
    sendSuccess(res, httpStatus.OK, null);
});
