import { z } from "zod";

export const ApplicationStatusEnum = z.enum(["NEW", "REVIEW", "INTERVIEW", "REJECTED", "HIRED"]);

export const createApplicationContract = {
    body: z.object({
        jobId:      z.string().cuid("Invalid job ID"),
        firstName:  z.string().min(1, "First name is required"),
        lastName:   z.string().min(1, "Last name is required"),
        email:      z.string().email("Invalid email"),
        phone:      z.string().optional(),
        coverNote:  z.string().max(5000).optional(),
        resumeFile: z.string().min(1, "Resume file is required"),
    }),
};

export const updateApplicationStatusContract = {
    params: z.object({ id: z.string().cuid("Invalid application ID") }),
    body:   z.object({ status: ApplicationStatusEnum }),
};

export const getApplicationsContract = {
    query: z.object({
        cursor: z.string().optional(),
        limit:  z.coerce.number().int().min(1).max(100).optional().default(20),
        sort:   z.enum(["createdAt"]).optional().default("createdAt"),
        order:  z.enum(["asc", "desc"]).optional().default("desc"),
        jobId:  z.string().cuid().optional(),
        status: ApplicationStatusEnum.optional(),
    }),
};

export const idParamContract = {
    params: z.object({ id: z.string().cuid("Invalid ID") }),
};

export type CreateApplicationInput     = z.infer<typeof createApplicationContract.body>;
export type UpdateApplicationStatusBody = z.infer<typeof updateApplicationStatusContract.body>;
export type GetApplicationsQuery        = z.infer<typeof getApplicationsContract.query>;
