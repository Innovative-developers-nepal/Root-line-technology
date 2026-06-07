"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Container, Button, Separator } from "@rootline/ui/components";
import { RichTextRenderer } from "@rootline/ui/editor";
import { FadeUp, Stagger, Aurora, DotBackground } from "@rootline/ui/motion";
import type { Service } from "@rootline/api-client";
import { getServiceIcon } from "@/lib/service-icons";
import { SERVICE_COVERAGE } from "@/data/service-coverage";
import { ServiceCard } from "./service-card";
import { ServiceCoverageCard } from "./service-coverage-card";

export function ServiceDetail({
  service,
  related,
}: {
  service: Service;
  related: Service[];
}) {
  const Icon = getServiceIcon(service);
  const coverage = SERVICE_COVERAGE[service.slug];

  return (
    <main className="min-h-dvh">
      {/* Cover image */}
      {service.ogImage && (
        <div className="relative aspect-2/1 w-full overflow-hidden bg-muted lg:aspect-3/1">
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
      <div className="relative overflow-hidden">
        <Aurora intensity="subtle" />
        <Container size="md" className="relative py-16 md:py-20">
          <FadeUp>
            <div className="mb-6 inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-display text-5xl leading-tight tracking-tight text-foreground md:text-7xl">
              {service.title}
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              {service.summary}
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link href="/contact">
                <Icon className="mr-2 h-4 w-4" aria-hidden />
                Get {service.title}
              </Link>
            </Button>
          </FadeUp>
        </Container>
      </div>

      {/* Coverage areas */}
      {coverage && coverage.length > 0 && (
        <div className="relative overflow-hidden">
          <DotBackground fade />
          <Container size="md" className="relative pb-16 pt-8">
            <FadeUp>
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                Areas Covered by Our {service.title} Services
              </h2>
            </FadeUp>
            <Stagger gap={0.08}>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {coverage.map((area) => (
                  <div key={area.title}>
                    <ServiceCoverageCard
                      title={area.title}
                      description={area.description}
                    />
                  </div>
                ))}
              </div>
            </Stagger>
          </Container>
        </div>
      )}

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
        <div className="relative overflow-hidden border-t">
          <DotBackground fade />
          <Container className="relative py-16 md:py-20">
            <FadeUp>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                Explore
              </span>
              <h2 className="font-display text-2xl tracking-tight text-foreground">
                More services
              </h2>
            </FadeUp>
            <Stagger gap={0.08}>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((svc, i) => (
                  <div key={svc.slug}>
                    <ServiceCard service={svc} index={i} />
                  </div>
                ))}
              </div>
            </Stagger>
          </Container>
        </div>
      )}
    </main>
  );
}
