import { SiteNav } from "./site-nav";

const SERVICE_LINKS = [
  { label: "Overview", href: "/services" },
  { label: "VAPT", href: "/services/vapt" },
  { label: "Mobile Development", href: "/services/mobile-flutter" },
  { label: "Web Development", href: "/services/web-apps" },
];

export function SiteNavWithServices() {
  return <SiteNav serviceLinks={SERVICE_LINKS} />;
}
