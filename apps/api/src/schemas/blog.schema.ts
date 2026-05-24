import { z } from "zod";

const tiptapJson = z.record(z.string(), z.any());

export const createBlogPostContract = {
    body: z.object({
        slug:       z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
        title:      z.string().min(1, "Title is required"),
        excerpt:    z.string().min(1, "Excerpt is required"),
        content:    tiptapJson,
        coverImage: z.string().url("Invalid cover image URL").optional(),
        category:   z.string().min(1, "Category is required"),
        tags:       z.array(z.string()).default([]),
        author:     z.string().min(1, "Author is required"),
        readTime:   z.string().min(1, "Read time is required"),
        published:  z.boolean().default(false),
    }),
};

export const updateBlogPostContract = {
    params: z.object({ id: z.string().cuid("Invalid blog post ID") }),
    body:   createBlogPostContract.body.partial(),
};

export const getBlogPostsContract = {
    query: z.object({
        cursor:    z.string().optional(),
        limit:     z.coerce.number().int().min(1).max(100).optional().default(20),
        sort:      z.enum(["createdAt", "publishedAt", "title"]).optional().default("createdAt"),
        order:     z.enum(["asc", "desc"]).optional().default("desc"),
        category:  z.string().optional(),
        published: z.enum(["true", "false"]).optional(),
    }),
};

export const slugParamContract = {
    params: z.object({ slug: z.string().min(1) }),
};

export const idParamContract = {
    params: z.object({ id: z.string().cuid("Invalid ID") }),
};

export type CreateBlogPostInput = z.infer<typeof createBlogPostContract.body>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostContract.body>;
export type GetBlogPostsQuery   = z.infer<typeof getBlogPostsContract.query>;
