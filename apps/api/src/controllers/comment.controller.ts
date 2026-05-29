import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as commentService from "../services/comment.service";
import httpStatus from "http-status";

export const getComments = asyncHandler(async (req, res) => {
    const comments = await commentService.getCommentsBySlug(req.params.slug as string);
    sendSuccess(res, httpStatus.OK, comments);
});

export const createComment = asyncHandler(async (req: AuthRequest, res) => {
    const slug = req.params.slug as string;
    const comment = await commentService.createComment(slug, req.body, req.user?.id);
    sendSuccess(res, httpStatus.CREATED, comment);
});

export const createReply = asyncHandler(async (req: AuthRequest, res) => {
    const reply = await commentService.createReply(req.params.id as string, req.body, req.user?.id);
    sendSuccess(res, httpStatus.CREATED, reply);
});

export const adminGetAllComments = asyncHandler(async (_req: AuthRequest, res) => {
    const comments = await commentService.adminGetAllComments();
    sendSuccess(res, httpStatus.OK, comments);
});

export const adminToggleApproval = asyncHandler(async (req: AuthRequest, res) => {
    const result = await commentService.adminToggleApproval(req.params.id as string);
    sendSuccess(res, httpStatus.OK, result);
});

export const adminDeleteComment = asyncHandler(async (req: AuthRequest, res) => {
    await commentService.adminDeleteComment(req.params.id as string);
    sendSuccess(res, httpStatus.OK, null);
});
