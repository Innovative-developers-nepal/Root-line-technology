import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as serviceService from "../services/service.service";
import { buildPaginationMeta } from "../utils/paginator";
import httpStatus from "http-status";

export const createService = asyncHandler(async (req: AuthRequest, res) => {
    const item = await serviceService.createService(req.body);
    sendSuccess(res, httpStatus.CREATED, item);
});

export const getServices = asyncHandler(async (req, res) => {
    const result = await serviceService.getServices(req.query as any);
    const meta   = buildPaginationMeta(result.services, Number(req.query.limit) || 50);
    sendSuccess(res, httpStatus.OK, result.services, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
    const item = await serviceService.getServiceBySlug(req.params.slug as string);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminGetServices = asyncHandler(async (req: AuthRequest, res) => {
    const result = await serviceService.getServices(req.query as any, true);
    const meta   = buildPaginationMeta(result.services, Number(req.query.limit) || 50);
    sendSuccess(res, httpStatus.OK, result.services, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const adminGetServiceById = asyncHandler(async (req: AuthRequest, res) => {
    const item = await serviceService.getServiceById(req.params.id as string);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminUpdateService = asyncHandler(async (req: AuthRequest, res) => {
    const item = await serviceService.updateService(req.params.id as string, req.body);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminToggleServicePublished = asyncHandler(async (req: AuthRequest, res) => {
    const item = await serviceService.toggleServicePublished(req.params.id as string);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminDeleteService = asyncHandler(async (req: AuthRequest, res) => {
    await serviceService.deleteService(req.params.id as string);
    sendSuccess(res, httpStatus.OK, null);
});
