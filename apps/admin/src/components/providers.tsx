"use client";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ApiProvider } from "@rootline/api-client";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
      <ApiProvider>{children}</ApiProvider>
    </ThemeProvider>
  );
}
