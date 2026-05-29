import { z } from "zod";

export const createCommentContract = {
    params: z.object({ slug: z.string().min(1) }),
    body:   z.object({
        authorName:  z.string().min(1, "Name is required").max(100),
        authorEmail: z.string().email("Invalid email"),
        content:     z.string().min(1, "Comment is required").max(2000),
    }),
};

export const createReplyContract = {
    params: z.object({ id: z.string().cuid("Invalid comment ID") }),
    body:   z.object({
        authorName:  z.string().min(1, "Name is required").max(100),
        authorEmail: z.string().email("Invalid email"),
        content:     z.string().min(1, "Reply is required").max(2000),
    }),
};

export const approveCommentContract = {
    params: z.object({ id: z.string().cuid("Invalid comment ID") }),
};

export const deleteCommentContract = {
    params: z.object({ id: z.string().cuid("Invalid comment ID") }),
};

export const listCommentsContract = {
    params: z.object({ slug: z.string().min(1) }),
};

export type CreateCommentInput = z.infer<typeof createCommentContract.body>;
export type CreateReplyInput = z.infer<typeof createReplyContract.body>;
