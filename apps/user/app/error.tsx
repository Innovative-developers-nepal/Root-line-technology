"use client";
import { Section } from "@rootline/ui/blocks";
import { Container, Button } from "@rootline/ui/components";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-dvh">
      <Section spacing="xl">
        <Container>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-destructive">Error</p>
            <h1 className="mt-4 font-display text-5xl">Something went wrong</h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Try again or head back home. We have been notified.
            </p>
            <div className="mt-8">
              <Button onClick={reset}>Try again</Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
