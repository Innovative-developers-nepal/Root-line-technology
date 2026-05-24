"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Users,
  Briefcase,
  FileText,
  Mail,
  UserCog,
  Inbox,
} from "lucide-react";
import { cn } from "@rootline/ui/lib/cn";

const ITEMS = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Services", href: "/services", icon: Wrench },
  { label: "Team", href: "/team", icon: Users },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Applicants", href: "/applicants", icon: Inbox },
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "Contacts", href: "/contacts", icon: Mail },
  { label: "Users", href: "/users", icon: UserCog },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <img src="/logo.png" alt="Rootline Technology" width={140} height={36} className="h-7 w-auto" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
