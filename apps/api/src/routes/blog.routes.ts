import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as blogController from "../controllers/blog.controller";
import { PERMISSIONS } from "../config/permissions";
import {
    createBlogPostContract,
    updateBlogPostContract,
    getBlogPostsContract,
    slugParamContract,
    idParamContract,
} from "../schemas/blog.schema";

const router = Router();

// Public routes
router.get(
    "/",
    validate(getBlogPostsContract),
    blogController.getBlogPosts
);

router.get(
    "/:slug",
    validate(slugParamContract),
    blogController.getBlogPostBySlug
);

// Admin routes
router.post(
    "/admin",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.WRITE),
    validate(createBlogPostContract),
    blogController.createBlogPost
);

router.get(
    "/admin/all",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.READ),
    validate(getBlogPostsContract),
    blogController.adminGetBlogPosts
);

router.get(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.READ),
    validate(idParamContract),
    blogController.adminGetBlogPostById
);

router.put(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.WRITE),
    validate(updateBlogPostContract),
    blogController.adminUpdateBlogPost
);

router.patch(
    "/admin/:id/publish",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.WRITE),
    validate(idParamContract),
    blogController.adminToggleBlogPublished
);

router.delete(
    "/admin/:id",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.DELETE),
    validate(idParamContract),
    blogController.adminDeleteBlogPost
);

export default router;
