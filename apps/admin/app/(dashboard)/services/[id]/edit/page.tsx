"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { useServiceList } from "@rootline/api-client";
import { ResourceFormShell } from "@/components/resource-form-shell";
import { ServiceForm } from "@/components/forms/service-form";
import { Skeleton } from "@rootline/ui/components";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useServiceList();
  const service = data?.find((s) => s.id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!service) notFound();

  return (
    <ResourceFormShell title="Edit service" description={service.title} backHref="/services">
      <ServiceForm initial={service} />
    </ResourceFormShell>
  );
}
