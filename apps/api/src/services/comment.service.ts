import { prisma } from "../config/prisma";
import CustomError from "../utils/customError";

const COMMENT_INCLUDE = {
    replies: {
        where: { isApproved: true },
        orderBy: { createdAt: "asc" as const },
        select: {
            id: true,
            authorName: true,
            content: true,
            createdAt: true,
            parentId: true,
        },
    },
};

export async function getCommentsBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new CustomError(404, "Blog post not found", "NOT_FOUND");

    const comments = await prisma.blogComment.findMany({
        where: { blogPostId: post.id, parentId: null, isApproved: true },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            authorName: true,
            content: true,
            createdAt: true,
            parentId: true,
            replies: {
                where: { isApproved: true },
                orderBy: { createdAt: "asc" },
                select: {
                    id: true,
                    authorName: true,
                    content: true,
                    createdAt: true,
                    parentId: true,
                },
            },
        },
    });

    return comments;
}

export async function createComment(slug: string, data: { authorName: string; authorEmail: string; content: string }, userId?: string) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new CustomError(404, "Blog post not found", "NOT_FOUND");

    const comment = await prisma.blogComment.create({
        data: {
            blogPostId: post.id,
            authorName: data.authorName,
            authorEmail: data.authorEmail,
            content: data.content,
            userId: userId ?? null,
        },
        select: {
            id: true,
            authorName: true,
            content: true,
            createdAt: true,
            isApproved: true,
        },
    });

    return comment;
}

export async function createReply(commentId: string, data: { authorName: string; authorEmail: string; content: string }, userId?: string) {
    const parent = await prisma.blogComment.findUnique({ where: { id: commentId } });
    if (!parent) throw new CustomError(404, "Comment not found", "NOT_FOUND");
    if (parent.parentId !== null) throw new CustomError(400, "Cannot reply to a reply", "INVALID_PARENT");

    const reply = await prisma.blogComment.create({
        data: {
            blogPostId: parent.blogPostId,
            parentId: commentId,
            authorName: data.authorName,
            authorEmail: data.authorEmail,
            content: data.content,
            userId: userId ?? null,
        },
        select: {
            id: true,
            authorName: true,
            content: true,
            createdAt: true,
            isApproved: true,
            parentId: true,
        },
    });

    return reply;
}

export async function adminGetAllComments() {
    return prisma.blogComment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            blogPost: { select: { title: true, slug: true } },
        },
    });
}

export async function adminToggleApproval(id: string) {
    const comment = await prisma.blogComment.findUnique({ where: { id } });
    if (!comment) throw new CustomError(404, "Comment not found", "NOT_FOUND");

    return prisma.blogComment.update({
        where: { id },
        data: { isApproved: !comment.isApproved },
        select: {
            id: true,
            isApproved: true,
            authorName: true,
            content: true,
        },
    });
}

export async function adminDeleteComment(id: string) {
    const comment = await prisma.blogComment.findUnique({ where: { id } });
    if (!comment) throw new CustomError(404, "Comment not found", "NOT_FOUND");

    await prisma.blogComment.delete({ where: { id } });
}
