"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Container, Button, Separator } from "@rootline/ui/components";
import { RichTextRenderer } from "@rootline/ui/editor";
import { FadeUp } from "@rootline/ui/motion";
import type { Service } from "@rootline/api-client";
import { getServiceIcon } from "@/lib/service-icons";
import { ServiceCard } from "./service-card";

export function ServiceDetail({
  service,
  related,
}: {
  service: Service;
  related: Service[];
}) {
  const Icon = getServiceIcon(service);
  return (
    <main className="min-h-dvh">
      {/* Cover image */}
      {service.ogImage && (
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-muted lg:aspect-[3/1]">
          <img
            src={service.ogImage}
            alt={service.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Back link */}
      <div className="border-b">
        <Container size="md" className="py-4">
          <Link
            href="/services"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; All Services
          </Link>
        </Container>
      </div>

      {/* Hero */}
      <Container size="md" className="py-16 md:py-20">
        <FadeUp>
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-8 w-8" />
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="mt-6 font-display text-5xl leading-tight tracking-tight text-foreground md:text-6xl">
            {service.title}
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
            {service.summary}
          </p>
        </FadeUp>
      </Container>

      {/* Body */}
      {!!service.body && (
        <Container size="md" className="pb-16">
          <FadeUp>
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <RichTextRenderer content={service.body as Record<string, unknown>} />
            </article>
          </FadeUp>
        </Container>
      )}

      {/* CTA */}
      <Container size="md" className="pb-16">
        <Separator className="mb-12" />
        <FadeUp>
          <div className="flex flex-col items-start gap-6 rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12">
            <div>
              <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground">
                Interested in {service.title}?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Let&apos;s discuss how we can help. Every engagement starts with a
                scoping call — no commitment, no pressure.
              </p>
            </div>
            <Button asChild size="lg" variant="dark" className="rounded-full pl-3 pr-4">
              <Link href="/contact">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                Get in touch
              </Link>
            </Button>
          </div>
        </FadeUp>
      </Container>

      {/* Related services */}
      {related.length > 0 && (
        <div className="border-t bg-muted/30">
          <Container className="py-16 md:py-20">
            <FadeUp>
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                More services
              </h2>
            </FadeUp>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((svc, i) => (
                <ServiceCard key={svc.slug} service={svc} index={i} />
              ))}
            </div>
          </Container>
        </div>
      )}
    </main>
  );
}
