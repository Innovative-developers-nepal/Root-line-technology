"use client";
import * as React from "react";
import { Container } from "@rootline/ui/components";

type Logo = { name: string; svg: React.ReactNode };

const MicrosoftLogo = (
  <svg viewBox="0 0 23 23" className="h-5 w-5" aria-hidden>
    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
    <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
    <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
    <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
  </svg>
);

const MetaLogo = (
  <svg viewBox="0 0 36 24" className="h-5 w-7" aria-hidden>
    <defs>
      <linearGradient id="meta-g" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0064E1" />
        <stop offset="50%" stopColor="#0082FB" />
        <stop offset="100%" stopColor="#00DCFA" />
      </linearGradient>
    </defs>
    <path
      d="M6 12c0-5 2.5-8 6-8 2.5 0 4.5 1.8 6.5 5 .8 1.3 1.5 2.5 2.2 3.6C22.8 16 24.5 18 27 18c2.2 0 3.5-1.6 3.5-4s-1.3-4-3.5-4c-1.8 0-3.2 1.3-4.8 3.6-.7-1.1-1.4-2.3-2.2-3.6C18 7 16 5 13 5 8 5 4 9 4 14s3 5 5 5c1.8 0 3.2-1.3 4.7-3.4-.5-.8-1-1.6-1.5-2.4C11 14.6 10 16 9 16c-1.5 0-3-1-3-4z"
      fill="url(#meta-g)"
    />
  </svg>
);

const LinkedInLogo = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <rect width="24" height="24" rx="3" fill="#0A66C2" />
    <path
      d="M7.2 9.5h2.4v8H7.2v-8zm1.2-3.7a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8zM11.5 9.5h2.3v1.1h.03c.32-.6 1.1-1.25 2.27-1.25 2.43 0 2.88 1.6 2.88 3.67v4.48h-2.4v-3.97c0-.95-.02-2.17-1.32-2.17s-1.53 1.03-1.53 2.1v4.04h-2.4v-8z"
      fill="white"
    />
  </svg>
);

const GoogleLogo = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path
      d="M21.6 12.23c0-.7-.06-1.37-.18-2.02H12v3.82h5.4a4.6 4.6 0 01-2 3.03v2.5h3.23c1.9-1.74 2.97-4.3 2.97-7.33z"
      fill="#4285F4"
    />
    <path
      d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.4.96-2.61 0-4.82-1.76-5.6-4.13H3.05v2.6A10 10 0 0012 22z"
      fill="#34A853"
    />
    <path
      d="M6.4 13.9a6 6 0 010-3.8V7.5H3.05a10 10 0 000 9l3.35-2.6z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.97c1.47 0 2.79.5 3.83 1.5l2.86-2.86A10 10 0 003.05 7.5l3.35 2.6C7.18 7.73 9.39 5.97 12 5.97z"
      fill="#EA4335"
    />
  </svg>
);

const AmazonLogo = (
  <svg viewBox="0 0 32 24" className="h-5 w-7" aria-hidden>
    <path
      d="M19.3 14.4c-3 2.2-7.4 3.4-11.2 3.4a20 20 0 01-13.6-5.2c-.3-.25-.03-.6.32-.4 4.4 2.55 9.84 4.1 15.45 4.1 3.7 0 7.8-.78 11.55-2.36.56-.24 1.04.37.48.78z"
      fill="currentColor"
      transform="translate(6 0)"
    />
    <path
      d="M22.6 12.5c-.38-.5-2.55-.24-3.52-.12-.3.04-.34-.22-.07-.4 1.72-1.22 4.55-.87 4.88-.46.33.42-.1 3.26-1.72 4.62-.25.2-.5.1-.38-.18.4-.94 1.2-3 .82-3.46z"
      fill="currentColor"
      transform="translate(6 0)"
    />
  </svg>
);

const GitHubLogo = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path
      d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.25.8-.55v-2c-3.34.72-4.05-1.4-4.05-1.4-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.74.08-.74 1.22.08 1.86 1.26 1.86 1.26 1.08 1.86 2.84 1.32 3.53 1 .1-.78.42-1.32.76-1.62-2.66-.3-5.46-1.34-5.46-5.95 0-1.32.46-2.4 1.24-3.24-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.78.84 1.24 1.92 1.24 3.24 0 4.62-2.8 5.64-5.47 5.94.43.37.82 1.1.82 2.22v3.28c0 .32.2.7.82.55A12 12 0 0012 .3z"
      fill="currentColor"
    />
  </svg>
);

const LOGOS: Logo[] = [
  { name: "Microsoft", svg: MicrosoftLogo },
  { name: "Meta", svg: MetaLogo },
  { name: "LinkedIn", svg: LinkedInLogo },
  { name: "Google", svg: GoogleLogo },
  { name: "Amazon", svg: AmazonLogo },
  { name: "GitHub", svg: GitHubLogo },
];

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 px-8 py-2 text-muted-foreground/80 transition-colors hover:text-foreground">
      {logo.svg}
      <span className="font-display text-lg tracking-tight">{logo.name}</span>
    </div>
  );
}

export function LandingLogos() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="relative py-16 md:py-20 flex w-full flex-col items-center justify-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(0,0,0,0.04),transparent_70%)] dark:bg-[radial-gradient(60%_50%_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"
      />
      <Container className="flex w-full flex-col items-center">
        <div className="mb-14 flex flex-col items-center gap-4 text-center">
          <h2 className="max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            Developers from these orgs
            <br />
            <span className="bg-linear-to-br from-primary via-accent to-primary/70 bg-clip-text text-transparent">
              have shipped alongside us.
            </span>
          </h2>
          <p className="max-w-md text-sm leading-[1.65] text-muted-foreground">
            Past collaborators and team alumni — not endorsements.
          </p>
        </div>

        <div
          className="group relative w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex w-max animate-[rootline-marquee_30s_linear_infinite] motion-reduce:animate-none group-hover:[animation-play-state:paused]">
            {items.map((logo, i) => (
              <LogoItem key={`${logo.name}-${i}`} logo={logo} />
            ))}
          </div>
        </div>
      </Container>

      <style jsx global>{`
        @keyframes rootline-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
