export type AnalyticsEvents = {
  contact_submitted: { subject: string };
  application_submitted: { jobSlug: string };
  blog_read: { slug: string; readingTime?: number };
  service_section_viewed: { section: "vapt" | "mobile-flutter" | "web-apps" };
  cta_clicked: { id: string; location: string };
  nav_clicked: { item: string };
};

export type AnalyticsEventName = keyof AnalyticsEvents;
