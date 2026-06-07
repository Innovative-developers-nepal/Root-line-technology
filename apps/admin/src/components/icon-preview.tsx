"use client";
import * as React from "react";
import type { LucideIcon } from "lucide-react";
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
  Search,
  Eye,
  Settings,
  Wrench,
  PenTool,
  Palette,
  Figma,
  HelpCircle,
} from "lucide-react";
import { cn } from "@rootline/ui/lib/cn";

const ICON_MAP: Record<string, LucideIcon> = {
  // slug keys
  vapt: ShieldCheck,
  "mobile-flutter": Smartphone,
  "web-apps": Globe,
  // kebab-case lucide names
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  globe: Globe,
  lock: Lock,
  zap: Zap,
  code: Code,
  database: Database,
  server: Server,
  cloud: Cloud,
  layers: Layers,
  box: Box,
  cpu: Cpu,
  terminal: Terminal,
  package: Package,
  search: Search,
  eye: Eye,
  settings: Settings,
  wrench: Wrench,
  "pen-tool": PenTool,
  palette: Palette,
  figma: Figma,
};

function toKebab(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function IconPreview({ value }: { value: string | undefined }) {
  const key = toKebab(value as string);
  const Icon: LucideIcon | undefined = key ? ICON_MAP[key] : undefined;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
        Icon
          ? "border-primary/20 bg-primary/5 text-primary"
          : "border-border/50 bg-muted/20 text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "inline-flex size-5 items-center justify-center",
          Icon ? "text-primary" : "text-muted-foreground/50",
        )}
      >
        {Icon ? (
          <Icon className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
      </span>
      <span>{key || "no icon"}</span>
    </div>
  );
}
