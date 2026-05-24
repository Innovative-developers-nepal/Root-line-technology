"use client";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ApiProvider } from "@rootline/api-client";
import { PostHogProvider } from "@rootline/analytics";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ApiProvider>
        <PostHogProvider
          apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
          apiHost={process.env.NEXT_PUBLIC_POSTHOG_HOST}
        >
          {children}
        </PostHogProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}
