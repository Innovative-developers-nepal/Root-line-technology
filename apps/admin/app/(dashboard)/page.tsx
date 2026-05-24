"use client";
import Link from "next/link";
import {
  Users,
  Mail,
  FileText,
  FolderOpen,
  TrendingUp,
  Inbox,
} from "lucide-react";
import { Card, Skeleton, Badge } from "@rootline/ui/components";
import { useDashboardStats, useApplicationList, useJobList } from "@rootline/api-client";
import { formatDate, formatNumber } from "@rootline/utils";

function StatCard({
  label,
  value,
  hint,
  Icon,
  href,
  loading,
}: {
  label: string;
  value: number | string;
  hint?: string;
  Icon: typeof Users;
  href?: string;
  loading?: boolean;
}) {
  const body = (
    <Card className="flex flex-col gap-3 p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <p className="font-display text-3xl">{value}</p>
      )}
      {hint && !loading && <p className="text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
  return href ? <Link href={href as never}>{body}</Link> : body;
}

export default function OverviewPage() {
  const stats = useDashboardStats();
  const apps = useApplicationList();
  const jobs = useJobList();

  const openJobs = jobs.data?.pages
    .flatMap((p) => p.items)
    .filter((j) => j.isOpen).length;

  const newApplicants = apps.data?.pages
    .flatMap((p) => p.items)
    .filter((a) => a.status === "NEW").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Snapshot of CMS activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Contacts"
          value={stats.data ? formatNumber(stats.data.contacts.total) : "—"}
          hint={stats.data ? `${formatNumber(stats.data.contacts.pending)} pending` : undefined}
          Icon={Mail}
          href="/contacts"
          loading={stats.isLoading}
        />
        <StatCard
          label="Applicants"
          value={apps.data ? formatNumber(apps.data.pages.flatMap((p) => p.items).length) : "—"}
          hint={newApplicants != null ? `${formatNumber(newApplicants)} new` : undefined}
          Icon={Inbox}
          href="/applicants"
          loading={apps.isLoading}
        />
        <StatCard
          label="Open jobs"
          value={openJobs != null ? formatNumber(openJobs) : "—"}
          Icon={TrendingUp}
          href="/jobs"
          loading={jobs.isLoading}
        />
        <StatCard
          label="Blog posts"
          value={stats.data ? formatNumber(stats.data.blog.total) : "—"}
          hint={stats.data ? `${formatNumber(stats.data.blog.published)} published` : undefined}
          Icon={FileText}
          href="/blog"
          loading={stats.isLoading}
        />
        <StatCard
          label="Case studies"
          value={stats.data ? formatNumber(stats.data.caseStudies.total) : "—"}
          Icon={FolderOpen}
          loading={stats.isLoading}
        />
        <StatCard
          label="Users"
          value={stats.data ? formatNumber(stats.data.users.total) : "—"}
          hint={stats.data ? `${formatNumber(stats.data.users.active)} active` : undefined}
          Icon={Users}
          href="/users"
          loading={stats.isLoading}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Recent contacts</h2>
          <Link href="/contacts" className="text-xs text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {stats.isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          {stats.data?.recentContacts.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Inbox empty.</p>
          )}
          {stats.data?.recentContacts.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {c.firstName} {c.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">{c.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{c.subject.replace("_", " ")}</Badge>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {formatDate(c.createdAt, "relative")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-xl">PostHog analytics</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Page-view, contact-submission, and application-submission events ship via the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@rootline/analytics</code> track
          API. Detailed charts wire to PostHog Insights in production via the project key.
        </p>
        <a
          href="https://app.posthog.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm text-primary hover:underline"
        >
          Open PostHog dashboard →
        </a>
      </Card>
    </div>
  );
}
