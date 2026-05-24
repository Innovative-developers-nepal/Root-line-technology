import { z } from "zod";

const ROLE_NAMES = ["SUPER_ADMIN", "ADMIN", "BUSINESS_OWNER", "MANAGER", "ANALYST", "MEMBER"] as const;

export const createUserSchema = z.object({
    email: z.string("Email is required").email("Invalid email"),
    password: z.string("Password is required").min(8, "Password must be at least 8 characters"),
    firstName: z.string("First name is required").min(1, "First name cannot be empty"),
    lastName: z.string("Last name is required").min(1, "Last name cannot be empty"),
    roleName: z.enum(ROLE_NAMES).optional(),
});

export const updateUserSchema = z.object({
    firstName: z.string().min(1, "First name cannot be empty").optional(),
    lastName: z.string().min(1, "Last name cannot be empty").optional(),
    email: z.string().email("Invalid email").optional(),
    avatar: z.string().url("Invalid URL").optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
