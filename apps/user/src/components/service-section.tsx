"use client";
import { ShieldCheck, Smartphone, Globe, type LucideIcon } from "lucide-react";
import { Section, SectionHeading } from "@rootline/ui/blocks";
import { Container } from "@rootline/ui/components";
import { useScrollReveal } from "@rootline/ui/motion";

const ICON_MAP: Record<string, LucideIcon> = {
  vapt: ShieldCheck,
  "mobile-flutter": Smartphone,
  "web-apps": Globe,
};

export function ServiceSection({
  slug,
  title,
  summary,
  body,
  tone,
}: {
  slug: string;
  title: string;
  summary: string;
  body: string;
  tone: "default" | "muted";
}) {
  const ref = useScrollReveal<HTMLDivElement>({
    selector: "[data-reveal]",
    y: 32,
    stagger: 0.12,
    duration: 0.8,
  });
  const Icon = ICON_MAP[slug] ?? Globe;

  return (
    <Section id={slug} tone={tone} className="scroll-mt-20">
      <Container>
        <div ref={ref} className="flex flex-col gap-6">
          <div
            data-reveal
            className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary"
          >
            <Icon className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <div data-reveal>
            <SectionHeading eyebrow={summary} title={title} />
          </div>
          <p
            data-reveal
            className="max-w-3xl text-base text-muted-foreground md:text-lg"
          >
            {body}
          </p>
        </div>
      </Container>
    </Section>
  );
}
