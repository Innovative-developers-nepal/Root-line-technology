import { fetchServiceList } from "@rootline/api-client";
import { SiteNav } from "./site-nav";

export async function SiteNavWithServices() {
  try {
    const services = await fetchServiceList();
    const serviceLinks = services.map((s) => ({
      label: s.title,
      href: `/services/${s.slug}`,
    }));
    return <SiteNav serviceLinks={serviceLinks} />;
  } catch {
    return <SiteNav />;
  }
}
