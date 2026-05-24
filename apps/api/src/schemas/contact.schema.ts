import { z } from "zod";

export const submitContactContract = {
    body: z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email"),
        subject: z.enum(["GENERAL_INQUIRY", "SALES", "SUPPORT", "PARTNERSHIP", "SERVICES_INQUIRY", "CAREERS", "OTHER"], "Subject is required"),
        message: z.string().min(1, "Message is required").max(5000, "Message too long"),
    }),
};

export const getContactsContract = {
    query: z.object({
        cursor: z.string().uuid().optional(),
        limit: z.coerce.number().int().min(1).max(100).optional().default(20),
        sort: z.enum(["createdAt", "email"]).optional().default("createdAt"),
        order: z.enum(["asc", "desc"]).optional().default("desc"),
        status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "SPAM"]).optional(),
    }),
};

export type SubmitContactInput = z.infer<typeof submitContactContract.body>;
export type GetContactsQuery = z.infer<typeof getContactsContract.query>;

export const updateContactStatusContract = {
    params: z.object({
        id: z.string().cuid("Invalid contact ID"),
    }),
    body: z.object({
        status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "SPAM"], "Invalid status"),
    }),
};

export type UpdateContactStatusParams = z.infer<typeof updateContactStatusContract.params>;
export type UpdateContactStatusBody = z.infer<typeof updateContactStatusContract.body>;
