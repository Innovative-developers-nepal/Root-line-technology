import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { buildMetadata, organizationJsonLd, websiteJsonLd, renderJsonLd } from "@rootline/seo";
import { Providers } from "@/components/providers";
import { SiteNavWithServices } from "@/components/site-nav-with-services";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { IntroSplash } from "@/components/intro-splash";
import { GrainOverlay } from "@rootline/ui/blocks";
import { PageViewTracker } from "@rootline/analytics";

export const metadata: Metadata = buildMetadata({});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Runs before body paint: tag <html> so a CSS pre-overlay hides
            content until IntroSplash takes over (prevents hero flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!sessionStorage.getItem('rootline:intro-shown')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-pending');}catch(e){}",
          }}
        />
        <IntroSplash />
        <Providers>
          <SiteNavWithServices />
          {children}
          <SiteFooter />
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
        </Providers>
        <CookieConsent />
        <GrainOverlay intensity="soft" blend="normal" className="fixed z-30 opacity-[0.18]" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: renderJsonLd(organizationJsonLd(), websiteJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
