"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Send } from "lucide-react";
import { Button, Container } from "@rootline/ui/components";
import { FadeUp } from "@rootline/ui/motion";

export function LandingCTA() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section className="w-full py-24 md:py-32">
      <Container>
        <FadeUp>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            {/* Left — headline */}
            <h2 className="font-display text-5xl leading-[0.98] tracking-[-0.03em] text-foreground md:text-6xl">
              Let&rsquo;s take this <span className="text-primary">journey</span>{" "}
              together.
            </h2>

            {/* Right — query bar + contact */}
            <div className="flex flex-col gap-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = query.trim();
                  router.push(q ? `/contact?q=${encodeURIComponent(q)}` : "/contact");
                }}
                className="flex items-center gap-2 rounded-full bg-foreground p-1.5 pl-4 shadow-sm"
              >
                <span aria-hidden className="grid size-6 shrink-0 place-items-center text-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="size-4">
                    <path d="M12 5 6 18M12 5l6 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="12" cy="5" r="2" fill="currentColor" />
                    <circle cx="6" cy="18" r="1.6" fill="currentColor" />
                    <circle cx="18" cy="14" r="1.6" fill="currentColor" />
                  </svg>
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a query…"
                  aria-label="Ask a query"
                  className="min-w-0 flex-1 bg-transparent text-sm text-background placeholder:text-background/50 outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
                >
                  Talk to us
                  <Send className="h-3.5 w-3.5 text-primary" strokeWidth={2} aria-hidden />
                </button>
              </form>

              <div className="text-center text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                or
              </div>

              <Button asChild size="xl" className="mx-auto rounded-full px-7">
                <Link href="/contact">
                  <Phone className="h-4 w-4" aria-hidden />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
