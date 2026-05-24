import Link from "next/link";
import { Section } from "@rootline/ui/blocks";
import { Container, Button } from "@rootline/ui/components";

export default function NotFound() {
  return (
    <main className="min-h-dvh">
      <Section spacing="xl">
        <Container>
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">404</p>
            <h1 className="mt-4 font-display text-5xl md:text-6xl">Page not found</h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              The page you are looking for was moved or never existed.
            </p>
            <div className="mt-8">
              <Button asChild>
                <Link href="/">Back home</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
