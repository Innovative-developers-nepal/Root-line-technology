import asyncHandler from "../utils/asyncHandler";
import sendSuccess from "../utils/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as blogService from "../services/blog.service";
import { buildPaginationMeta } from "../utils/paginator";
import httpStatus from "http-status";

export const createBlogPost = asyncHandler(async (req: AuthRequest, res) => {
    const post = await blogService.createBlogPost(req.body);
    sendSuccess(res, httpStatus.CREATED, post);
});

export const getBlogPosts = asyncHandler(async (req, res) => {
    const result = await blogService.getBlogPosts(req.query as any);
    const meta   = buildPaginationMeta(result.posts, Number(req.query.limit) || 20);
    sendSuccess(res, httpStatus.OK, result.posts, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const getBlogPostBySlug = asyncHandler(async (req, res) => {
    const post = await blogService.getBlogPostBySlug(req.params.slug as string);
    sendSuccess(res, httpStatus.OK, post);
});

// Admin variants

export const adminGetBlogPosts = asyncHandler(async (req: AuthRequest, res) => {
    const result = await blogService.getBlogPosts(req.query as any, true);
    const meta   = buildPaginationMeta(result.posts, Number(req.query.limit) || 20);
    sendSuccess(res, httpStatus.OK, result.posts, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
});

export const adminGetBlogPostById = asyncHandler(async (req: AuthRequest, res) => {
    const post = await blogService.getBlogPostById(req.params.id as string);
    sendSuccess(res, httpStatus.OK, post);
});

export const adminUpdateBlogPost = asyncHandler(async (req: AuthRequest, res) => {
    const post = await blogService.updateBlogPost(req.params.id as string, req.body);
    sendSuccess(res, httpStatus.OK, post);
});

export const adminToggleBlogPublished = asyncHandler(async (req: AuthRequest, res) => {
    const post = await blogService.toggleBlogPublished(req.params.id as string);
    sendSuccess(res, httpStatus.OK, post);
});

export const adminDeleteBlogPost = asyncHandler(async (req: AuthRequest, res) => {
    await blogService.deleteBlogPost(req.params.id as string);
    sendSuccess(res, httpStatus.OK, null);
});
