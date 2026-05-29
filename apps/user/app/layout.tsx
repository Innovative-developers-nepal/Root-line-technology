import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { buildMetadata, organizationJsonLd, websiteJsonLd, renderJsonLd } from "@rootline/seo";
import { Providers } from "@/components/providers";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { GrainOverlay } from "@rootline/ui/blocks";
import { PageViewTracker } from "@rootline/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <SiteNav />
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
