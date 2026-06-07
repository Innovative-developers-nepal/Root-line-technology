import type { Metadata } from "next";
import { buildMetadata, breadcrumbJsonLd, renderJsonLd, SITE } from "@rootline/seo";
import { LandingHero } from "@/components/landing-hero";
import { LandingLogos } from "@/components/landing-logos";
import { LandingQuotes } from "@/components/landing-quotes";
// import { LandingFeatures } from "@/components/landing-features";
import { LandingCTA } from "@/components/landing-cta";

export const metadata: Metadata = buildMetadata({
  title: "Engineering at the root",
  description: SITE.description,
  path: "/",
});

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <LandingHero />
      <LandingLogos />
      <LandingQuotes />
      {/* <LandingFeatures /> */}
      <LandingCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(breadcrumbJsonLd([{ name: "Home", url: SITE.url }])),
        }}
      />
    </main>
  );
}
