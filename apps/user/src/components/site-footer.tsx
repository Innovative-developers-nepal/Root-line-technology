import { Footer } from "@rootline/ui/blocks";
import { localBusinessJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { Facebook, Linkedin } from "lucide-react";

export function SiteFooter() {
  return (
    <>
      <Footer
        brand={
          <div className="flex flex-col gap-3">
            <span className="font-display text-2xl">Rootline Technology</span>
            <span className="text-sm text-muted-foreground">{SITE.tagline}</span>
            <div className="flex items-center gap-2">
              {/* <a
                href="https://facebook.com/rootlinetechnology"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rootline Technology on Facebook"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Facebook className="size-4" />
              </a> */}
              <a
                href="https://linkedin.com/company/rootline-technology"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rootline Technology on LinkedIn"
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
            <span className="mt-2 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Rootline Technology Pvt Ltd.
            </span>
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
              // { label: "Sitemap", href: "/sitemap.xml" },
            ],
          },
          {
            heading: "Legal",
            links: [
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ],
          },
          {
            heading: "Contact",
            links: [{ label: SITE.contact.email, href: `mailto:${SITE.contact.email}` }],
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(localBusinessJsonLd()) }}
      />
    </>
  );
}
