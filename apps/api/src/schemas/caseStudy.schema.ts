import { z } from "zod";

const tiptapJson = z.record(z.string(), z.any());

const metricSchema = z.object({
    label:       z.string(),
    value:       z.string(),
    description: z.string().optional(),
    delta:       z.string().optional(),
});

const statSchema = z.object({
    label: z.string(),
    value: z.string(),
});

const graphDataSchema = z.object({
    label: z.string(),
    value: z.number(),
    color: z.string().optional(),
});

const graphSchema = z.object({
    type:        z.enum(["bar", "line", "donut"]),
    title:       z.string(),
    description: z.string().optional(),
    data:        z.array(graphDataSchema),
});

const challengeSolutionSchema = z.object({
    challengeTitle:   z.string(),
    challengeContent: tiptapJson,
    solutionTitle:    z.string(),
    solutionContent:  tiptapJson,
});

export const createCaseStudyContract = {
    body: z.object({
        slug:               z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
        title:              z.string().min(1, "Title is required"),
        subtitle:           z.string().optional(),
        excerpt:            z.string().min(1, "Excerpt is required"),
        category:           z.string().min(1, "Category is required"),
        industry:           z.string().min(1, "Industry is required"),
        author:             z.string().min(1, "Author is required"),
        authorTitle:        z.string().optional(),
        readTime:           z.string().min(1, "Read time is required"),
        coverImage:         z.string().url("Invalid cover image URL").optional(),
        tags:               z.array(z.string()).default([]),
        metrics:            z.array(metricSchema).default([]),
        summaryStats:       z.array(statSchema).default([]),
        bottomStats:        z.array(statSchema).default([]),
        graphs:             z.array(graphSchema).default([]),
        tableOfContents:    z.array(z.string()).default([]),
        overviewContent:    tiptapJson,
        keyWinsContent:     tiptapJson,
        keyInsightContent:  tiptapJson,
        challengeSolutions: z.array(challengeSolutionSchema).default([]),
        published:          z.boolean().default(false),
    }),
};

export const updateCaseStudyContract = {
    params: z.object({ id: z.string().cuid("Invalid case study ID") }),
    body:   createCaseStudyContract.body.partial(),
};

export const getCaseStudiesContract = {
    query: z.object({
        cursor:    z.string().optional(),
        limit:     z.coerce.number().int().min(1).max(100).optional().default(20),
        sort:      z.enum(["createdAt", "publishedAt", "title"]).optional().default("createdAt"),
        order:     z.enum(["asc", "desc"]).optional().default("desc"),
        category:  z.string().optional(),
        industry:  z.string().optional(),
        published: z.enum(["true", "false"]).optional(),
    }),
};

export type CreateCaseStudyInput = z.infer<typeof createCaseStudyContract.body>;
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudyContract.body>;
export type GetCaseStudiesQuery  = z.infer<typeof getCaseStudiesContract.query>;
