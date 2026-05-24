import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as teamService from "../services/team.service";
import { buildPaginationMeta } from "../utils/paginator";
import httpStatus from "http-status";

export const getTeamMembers = asyncHandler(async (req, res) => {
    const result = await teamService.getTeamMembers(req.query as any);
    const meta   = buildPaginationMeta(result.members, Number(req.query.limit) || 50);
    sendSuccess(res, httpStatus.OK, result.members, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const adminGetTeamMembers = asyncHandler(async (req: AuthRequest, res) => {
    const result = await teamService.getTeamMembers(req.query as any, true);
    const meta   = buildPaginationMeta(result.members, Number(req.query.limit) || 50);
    sendSuccess(res, httpStatus.OK, result.members, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const adminGetTeamMemberById = asyncHandler(async (req: AuthRequest, res) => {
    const item = await teamService.getTeamMemberById(req.params.id as string);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminCreateTeamMember = asyncHandler(async (req: AuthRequest, res) => {
    const item = await teamService.createTeamMember(req.body);
    sendSuccess(res, httpStatus.CREATED, item);
});

export const adminUpdateTeamMember = asyncHandler(async (req: AuthRequest, res) => {
    const item = await teamService.updateTeamMember(req.params.id as string, req.body);
    sendSuccess(res, httpStatus.OK, item);
});

export const adminDeleteTeamMember = asyncHandler(async (req: AuthRequest, res) => {
    await teamService.deleteTeamMember(req.params.id as string);
    sendSuccess(res, httpStatus.OK, null);
});
