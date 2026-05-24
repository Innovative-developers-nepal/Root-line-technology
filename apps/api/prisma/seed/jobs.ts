import { PrismaClient } from "@prisma/client";
import { sectionsToTipTap } from "./tiptap";

const JOBS = [
  {
    slug: "senior-penetration-tester",
    title: "Senior Penetration Tester",
    department: "Security",
    location: "Remote / Kathmandu",
    type: "FULL_TIME",
    salaryRange: "$80K – $130K",
    isOpen: true,
    postedAt: new Date("2026-05-01"),
    body: sectionsToTipTap([
      { type: "heading", text: "About the Role" },
      { type: "paragraph", text: "We are looking for an experienced penetration tester to lead offensive security engagements for our clients. You will plan and execute manual-led penetration tests across web applications, mobile apps, APIs, and cloud infrastructure." },
      { type: "heading", text: "What You'll Do" },
      { type: "bullets", items: ["Lead VAPT engagements from scoping to delivery", "Produce high-quality penetration test reports with actionable findings", "Perform manual business logic testing beyond automated scanning", "Collaborate with development teams on remediation", "Contribute to internal tooling and methodology improvements"] },
      { type: "heading", text: "Requirements" },
      { type: "bullets", items: ["3+ years of hands-on penetration testing experience", "Deep knowledge of OWASP Top 10, MASVS, and PTES", "Proficiency with Burp Suite, Metasploit, and at least one scripting language", "Strong written English for client-facing reports", "Relevant certifications (OSCP, GPEN, or equivalent)"] },
    ]),
  },
  {
    slug: "flutter-developer",
    title: "Flutter Developer",
    department: "Engineering",
    location: "Remote / Kathmandu",
    type: "FULL_TIME",
    salaryRange: "$50K – $90K",
    isOpen: true,
    postedAt: new Date("2026-05-15"),
    body: sectionsToTipTap([
      { type: "heading", text: "About the Role" },
      { type: "paragraph", text: "We are building cross-platform mobile applications using Flutter and Dart. As a Flutter developer, you will design and implement features for production apps used by thousands of users." },
      { type: "heading", text: "What You'll Do" },
      { type: "bullets", items: ["Build and ship Flutter features across iOS and Android", "Implement offline-first architecture using Drift or similar", "Integrate with REST and GraphQL APIs", "Participate in code reviews and architecture discussions", "Optimize app performance and responsiveness"] },
      { type: "heading", text: "Requirements" },
      { type: "bullets", items: ["2+ years of Flutter development experience", "Strong understanding of Dart and state management (Riverpod preferred)", "Experience with native platform channels", "Familiarity with CI/CD for mobile (Codemagic or similar)", "Published apps on App Store or Play Store"] },
    ]),
  },
  {
    slug: "next-js-fullstack-engineer",
    title: "Next.js Full-Stack Engineer",
    department: "Engineering",
    location: "Remote / Kathmandu",
    type: "FULL_TIME",
    salaryRange: "$60K – $100K",
    isOpen: true,
    postedAt: new Date("2026-04-20"),
    body: sectionsToTipTap([
      { type: "heading", text: "About the Role" },
      { type: "paragraph", text: "We are looking for a full-stack engineer who can own Next.js applications end-to-end — from database schema design to deployment on Vercel." },
      { type: "heading", text: "What You'll Do" },
      { type: "bullets", items: ["Build and maintain production Next.js applications", "Design Postgres schemas and write efficient queries", "Implement authentication, payments, and RBAC systems", "Set up monitoring, logging, and incident response", "Mentor junior developers on best practices"] },
      { type: "heading", text: "Requirements" },
      { type: "bullets", items: ["3+ years of full-stack development experience", "Expertise in Next.js, React, and TypeScript", "Experience with Postgres, Prisma, and REST API design", "Knowledge of CI/CD pipelines and deployment strategies", "Understanding of web security fundamentals"] },
    ]),
  },
  {
    slug: "security-research-intern",
    title: "Security Research Intern",
    department: "Security",
    location: "Kathmandu (On-site)",
    type: "INTERN",
    salaryRange: "Stipend + Mentorship",
    isOpen: true,
    postedAt: new Date("2026-05-10"),
    body: sectionsToTipTap([
      { type: "heading", text: "About the Internship" },
      { type: "paragraph", text: "Join our security team for a 3-month paid internship. You will work alongside experienced pentesters on real client engagements and learn manual testing methodologies." },
      { type: "heading", text: "What You'll Learn" },
      { type: "bullets", items: ["Web application and API penetration testing", "Mobile app security assessment", "Report writing and vulnerability documentation", "Burp Suite, OWASP ZAP, and other industry tools", "Secure code review practices"] },
      { type: "heading", text: "Requirements" },
      { type: "bullets", items: ["Currently pursuing or recently completed a degree in CS, IT, or related field", "Basic understanding of web technologies (HTTP, HTML, JavaScript)", "Strong analytical and problem-solving skills", "Eagerness to learn and take feedback"] },
    ]),
  },
];

export async function seedJobs(prisma: PrismaClient): Promise<void> {
  for (const job of JOBS) {
    const data = {
      ...job,
      body: JSON.stringify(job.body),
    };
    await prisma.job.upsert({ where: { slug: job.slug }, update: data as any, create: data as any });
  }
  console.log(`  ✓ ${JOBS.length} jobs seeded`);
}
