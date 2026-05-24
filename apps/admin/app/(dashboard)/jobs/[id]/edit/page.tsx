"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { useJobList } from "@rootline/api-client";
import { Skeleton } from "@rootline/ui/components";
import { ResourceFormShell } from "@/components/resource-form-shell";
import { JobForm } from "@/components/forms/job-form";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useJobList();
  const job = data?.pages.flatMap((p) => p.items).find((j) => j.id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!job) notFound();

  return (
    <ResourceFormShell title="Edit job" description={job.title} backHref="/jobs">
      <JobForm initial={job} />
    </ResourceFormShell>
  );
}
