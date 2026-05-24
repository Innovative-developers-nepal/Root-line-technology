import { z } from "zod";

const tiptapJson = z.record(z.string(), z.any());

export const JobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]);

export const createJobContract = {
    body: z.object({
        slug:        z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
        title:       z.string().min(1, "Title is required"),
        department:  z.string().optional(),
        location:    z.string().min(1, "Location is required"),
        type:        JobTypeEnum.default("FULL_TIME"),
        body:        tiptapJson,
        salaryRange: z.string().optional(),
        isOpen:      z.boolean().default(true),
    }),
};

export const updateJobContract = {
    params: z.object({ id: z.string().cuid("Invalid job ID") }),
    body:   createJobContract.body.partial(),
};

export const getJobsContract = {
    query: z.object({
        cursor: z.string().optional(),
        limit:  z.coerce.number().int().min(1).max(100).optional().default(20),
        sort:   z.enum(["createdAt", "postedAt", "title"]).optional().default("postedAt"),
        order:  z.enum(["asc", "desc"]).optional().default("desc"),
        isOpen: z.enum(["true", "false"]).optional(),
        type:   JobTypeEnum.optional(),
    }),
};

export const slugParamContract = {
    params: z.object({ slug: z.string().min(1) }),
};

export const idParamContract = {
    params: z.object({ id: z.string().cuid("Invalid ID") }),
};

export type CreateJobInput = z.infer<typeof createJobContract.body>;
export type UpdateJobInput = z.infer<typeof updateJobContract.body>;
export type GetJobsQuery   = z.infer<typeof getJobsContract.query>;
