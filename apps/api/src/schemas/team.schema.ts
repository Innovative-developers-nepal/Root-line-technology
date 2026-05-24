import { z } from "zod";

const socialLinks = z.object({
    linkedin: z.string().url().optional(),
    twitter:  z.string().url().optional(),
    github:   z.string().url().optional(),
    website:  z.string().url().optional(),
}).partial().optional();

export const createTeamMemberContract = {
    body: z.object({
        name:        z.string().min(1, "Name is required"),
        role:        z.string().min(1, "Role is required"),
        bio:         z.string().optional(),
        avatar:      z.string().optional(),
        socialLinks: socialLinks,
        order:       z.coerce.number().int().min(0).default(0),
        published:   z.boolean().default(true),
    }),
};

export const updateTeamMemberContract = {
    params: z.object({ id: z.string().cuid("Invalid team member ID") }),
    body:   createTeamMemberContract.body.partial(),
};

export const getTeamMembersContract = {
    query: z.object({
        cursor:    z.string().optional(),
        limit:     z.coerce.number().int().min(1).max(100).optional().default(50),
        sort:      z.enum(["order", "createdAt", "name"]).optional().default("order"),
        order:     z.enum(["asc", "desc"]).optional().default("asc"),
        published: z.enum(["true", "false"]).optional(),
    }),
};

export const idParamContract = {
    params: z.object({ id: z.string().cuid("Invalid ID") }),
};

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberContract.body>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberContract.body>;
export type GetTeamMembersQuery   = z.infer<typeof getTeamMembersContract.query>;
