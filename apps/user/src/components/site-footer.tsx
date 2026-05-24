import { Footer } from "@rootline/ui/blocks";
import { localBusinessJsonLd, renderJsonLd, SITE } from "@rootline/seo";

export function SiteFooter() {
  return (
    <>
      <Footer
        brand={
          <div className="flex flex-col gap-2">
            <span className="font-display text-2xl">Rootline Technology</span>
            <span className="text-sm text-muted-foreground">{SITE.tagline}</span>
          </div>
        }
        columns={[
          {
            heading: "Company",
            links: [
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ],
          },
          {
            heading: "Resources",
            links: [
              { label: "Blog", href: "/blog" },
              { label: "Sitemap", href: "/sitemap.xml" },
            ],
          },
          {
            heading: "Contact",
            links: [{ label: SITE.contact.email, href: `mailto:${SITE.contact.email}` }],
          },
        ]}
        legal={<span>© {new Date().getFullYear()} Rootline Technology Pvt Ltd.</span>}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(localBusinessJsonLd()) }}
      />
    </>
  );
}
