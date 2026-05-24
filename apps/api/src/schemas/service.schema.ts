import { z } from "zod";

const tiptapJson = z.record(z.string(), z.any());

export const createServiceContract = {
    body: z.object({
        slug:           z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
        title:          z.string().min(1, "Title is required"),
        summary:        z.string().min(1, "Summary is required"),
        body:           tiptapJson,
        iconKey:        z.string().optional(),
        order:          z.coerce.number().int().min(0).default(0),
        published:      z.boolean().default(false),
        seoTitle:       z.string().optional(),
        seoDescription: z.string().optional(),
        ogImage:        z.string().url("Invalid OG image URL").optional(),
    }),
};

export const updateServiceContract = {
    params: z.object({ id: z.string().cuid("Invalid service ID") }),
    body:   createServiceContract.body.partial(),
};

export const getServicesContract = {
    query: z.object({
        cursor:    z.string().optional(),
        limit:     z.coerce.number().int().min(1).max(100).optional().default(50),
        sort:      z.enum(["order", "createdAt", "title"]).optional().default("order"),
        order:     z.enum(["asc", "desc"]).optional().default("asc"),
        published: z.enum(["true", "false"]).optional(),
    }),
};

export const slugParamContract = {
    params: z.object({ slug: z.string().min(1) }),
};

export const idParamContract = {
    params: z.object({ id: z.string().cuid("Invalid ID") }),
};

export type CreateServiceInput = z.infer<typeof createServiceContract.body>;
export type UpdateServiceInput = z.infer<typeof updateServiceContract.body>;
export type GetServicesQuery   = z.infer<typeof getServicesContract.query>;
