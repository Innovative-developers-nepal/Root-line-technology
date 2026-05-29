import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { optionalAuth } from "../middlewares/auth.middleware";
import { Permissions } from "../guards";
import { validate } from "../utils/validate";
import * as commentController from "../controllers/comment.controller";
import { PERMISSIONS } from "../config/permissions";
import {
    createCommentContract,
    createReplyContract,
    approveCommentContract,
    deleteCommentContract,
    listCommentsContract,
} from "../schemas/comment.schema";

const router = Router();

// Public routes
router.get(
    "/:slug/comments",
    validate(listCommentsContract),
    commentController.getComments
);

router.post(
    "/:slug/comments",
    optionalAuth,
    validate(createCommentContract),
    commentController.createComment
);

router.post(
    "/comments/:id/replies",
    optionalAuth,
    validate(createReplyContract),
    commentController.createReply
);

// Admin routes
router.get(
    "/admin/comments",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.READ),
    commentController.adminGetAllComments
);

router.put(
    "/admin/comments/:id/approve",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.WRITE),
    validate(approveCommentContract),
    commentController.adminToggleApproval
);

router.delete(
    "/admin/comments/:id",
    authenticateToken,
    Permissions(PERMISSIONS.BLOG.resource, PERMISSIONS.BLOG.actions.DELETE),
    validate(deleteCommentContract),
    commentController.adminDeleteComment
);

export default router;
