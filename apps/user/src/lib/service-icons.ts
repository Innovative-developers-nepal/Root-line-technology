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
  type LucideIcon,
} from "lucide-react";
import type { Service } from "@rootline/api-client";

const ICON_MAP: Record<string, LucideIcon> = {
  vapt: ShieldCheck,
  "mobile-flutter": Smartphone,
  "web-apps": Globe,
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

export function getServiceIcon(service: Service): LucideIcon {
  const key = toKebab(service.iconKey || service.slug);
  return ICON_MAP[key] ?? Globe;
}
