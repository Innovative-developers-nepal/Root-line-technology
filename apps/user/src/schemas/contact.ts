import { z } from "zod";

export const CONTACT_SUBJECTS = ["SERVICES_INQUIRY", "CAREERS", "OTHER", "GENERAL"] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export const contactFormSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  subject: z.enum(CONTACT_SUBJECTS),
  message: z.string().min(10, "At least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
