export interface ContactBody {
  name: string;
  email: string;
  subject: "Service Enquiry" | "Careers" | "General" | "Others";
  message: string;
}