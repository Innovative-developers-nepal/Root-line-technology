import { z } from "zod";

export const registerSchema = z.object({
    email:     z.string("Email is required").email("Invalid email"),
    password:  z.string("Password is required").min(8, "Password must be at least 8 characters"),
    firstName: z.string("First name is required").min(1, "First name cannot be empty"),
    lastName:  z.string("Last name is required").min(1, "Last name cannot be empty"),
});

export const loginSchema = z.object({
    email:    z.string("Email is required").email("Invalid email"),
    password: z.string("Password is required").min(1, "Password cannot be empty"),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword:     z.string().min(8, "New password must be at least 8 characters"),
});

export type RegisterInput        = z.infer<typeof registerSchema>;
export type LoginInput           = z.infer<typeof loginSchema>;
export type ChangePasswordInput  = z.infer<typeof changePasswordSchema>;
