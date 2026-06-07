import { SpotlightCard } from "@rootline/ui/motion";
import { cn } from "@rootline/ui/lib/cn";
import {
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  Zap,
  Code,
  Database,
  Server,
  Cloud,
  Layers,
  Box,
  Cpu,
  Terminal,
  Package,
  Eye,
  Wrench,
  Palette,
  Monitor,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "web/": Globe,
  web3: Code,
  mobile: Smartphone,
  network: Server,
  desktop: Monitor,
  cloud: Cloud,
  iot: Cpu,
  "cross-platform": Layers,
  "state management": Box,
  api: Code,
  native: Smartphone,
  "app store": Package,
  performance: Zap,
  testing: Wrench,
  "ci/cd": Wrench,
  "full-stack": Layers,
  database: Database,
  authentication: Lock,
  auth: Lock,
  frontend: Palette,
  devops: Terminal,
  accessibility: Eye,
};

function getCoverageIcon(title: string): LucideIcon {
  const key = title.toLowerCase();
  const match = Object.entries(ICON_MAP).find(([keyword]) =>
    key.includes(keyword),
  );
  return match ? match[1] : ShieldCheck;
}

export function ServiceCoverageCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const Icon = getCoverageIcon(title);
  return (
    <SpotlightCard
      className={cn(
        "flex flex-col gap-2 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md",
      )}
    >
      <span aria-hidden className="h-px w-8 bg-primary" />
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-display text-lg leading-tight tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </SpotlightCard>
  );
}
