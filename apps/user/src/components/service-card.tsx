"use client";
import Link from "next/link";
import { ShieldCheck, Smartphone, Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@rootline/ui/lib/cn";
import { FadeUp } from "@rootline/ui/motion";
import type { Service } from "@rootline/api-client";

const ICON_MAP: Record<string, React.ReactNode> = {
  vapt: <ShieldCheck className="h-6 w-6" />,
  "mobile-flutter": <Smartphone className="h-6 w-6" />,
  "web-apps": <Globe className="h-6 w-6" />,
};

function getIcon(slug: string) {
  return ICON_MAP[slug] ?? <Globe className="h-6 w-6" />;
}

export function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <FadeUp delay={index * 0.1}>
      <Link
        href={`/services/${service.slug}`}
        className="group block h-full"
      >
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-muted/30 p-8 transition-all duration-300",
            "hover:border-primary/40 hover:bg-muted/50",
          )}
        >
          <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {getIcon(service.slug)}
          </div>

          <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {service.title}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {service.summary}
          </p>

          <div className="flex-1" />

          <span className="mt-6 inline-flex translate-x-0 items-center gap-1.5 text-xs font-medium text-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
            Learn more
            <ArrowUpRight className="h-3.5 w-3.5 text-primary" aria-hidden />
          </span>
        </div>
      </Link>
    </FadeUp>
  );
}
