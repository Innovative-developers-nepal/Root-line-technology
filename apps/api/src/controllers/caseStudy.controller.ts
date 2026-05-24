import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as caseStudyService from "../services/caseStudy.service";
import { buildPaginationMeta } from "../utils/paginator";
import httpStatus from "http-status";

export const createCaseStudy = asyncHandler(async (req: AuthRequest, res) => {
    const study = await caseStudyService.createCaseStudy(req.body);
    sendSuccess(res, httpStatus.CREATED, study);
});

export const getCaseStudies = asyncHandler(async (req, res) => {
    const result = await caseStudyService.getCaseStudies(req.query as any);
    const meta   = buildPaginationMeta(result.caseStudies, Number(req.query.limit) || 20);
    sendSuccess(res, httpStatus.OK, result.caseStudies, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const getCaseStudyBySlug = asyncHandler(async (req, res) => {
    const study = await caseStudyService.getCaseStudyBySlug(req.params.slug as string);
    sendSuccess(res, httpStatus.OK, study);
});

// Admin variants

export const adminGetCaseStudies = asyncHandler(async (req: AuthRequest, res) => {
    const result = await caseStudyService.getCaseStudies(req.query as any, true);
    const meta   = buildPaginationMeta(result.caseStudies, Number(req.query.limit) || 20);
    sendSuccess(res, httpStatus.OK, result.caseStudies, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const adminGetCaseStudyById = asyncHandler(async (req: AuthRequest, res) => {
    const study = await caseStudyService.getCaseStudyById(req.params.id as string);
    sendSuccess(res, httpStatus.OK, study);
});

export const adminUpdateCaseStudy = asyncHandler(async (req: AuthRequest, res) => {
    const study = await caseStudyService.updateCaseStudy(req.params.id as string, req.body);
    sendSuccess(res, httpStatus.OK, study);
});

export const adminToggleCaseStudyPublished = asyncHandler(async (req: AuthRequest, res) => {
    const study = await caseStudyService.toggleCaseStudyPublished(req.params.id as string);
    sendSuccess(res, httpStatus.OK, study);
});

export const adminDeleteCaseStudy = asyncHandler(async (req: AuthRequest, res) => {
    await caseStudyService.deleteCaseStudy(req.params.id as string);
    sendSuccess(res, httpStatus.OK, null);
});
