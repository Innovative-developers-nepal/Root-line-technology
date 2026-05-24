"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { useTeamList } from "@rootline/api-client";
import { Skeleton } from "@rootline/ui/components";
import { ResourceFormShell } from "@/components/resource-form-shell";
import { TeamForm } from "@/components/forms/team-form";

export default function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useTeamList();
  const member = data?.find((m) => m.id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!member) notFound();

  return (
    <ResourceFormShell title="Edit team member" description={member.name} backHref="/team">
      <TeamForm initial={member} />
    </ResourceFormShell>
  );
}
