"use client";
import Link from "next/link";
import { Button } from "@rootline/ui/components";
import { DataTable, EmptyState, type ColumnDef } from "@rootline/ui/data";
import { useServiceList, useDeleteService, type Service } from "@rootline/api-client";
import { AdminPageHeader } from "@/components/page-header";
import { RowActions } from "@/components/row-actions";
import { formatDate } from "@rootline/utils";

export default function ServicesAdminPage() {
  const { data, isLoading } = useServiceList();
  const del = useDeleteService();

  const columns: ColumnDef<Service>[] = [
    { key: "title", header: "Title", cell: (s) => s.title },
    { key: "slug", header: "Slug", cell: (s) => <code className="text-xs">{s.slug}</code> },
    { key: "order", header: "Order", cell: (s) => s.order, align: "right" },
    { key: "published", header: "Status", cell: (s) => (s.published ? "Published" : "Draft") },
    { key: "updatedAt", header: "Updated", cell: (s) => formatDate(s.updatedAt) },
    {
      key: "actions",
      header: "",
      width: "56px",
      align: "right",
      cell: (s) => (
        <RowActions
          editHref={`/services/${s.id}/edit`}
          onDelete={() => del.mutateAsync(s.id)}
          deletePending={del.isPending}
        />
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Services"
        description="Marketing-site service offerings."
        actions={
          <Button asChild className="p-2 px-4">
            <Link href="/services/new">New service</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        rowKey={(s) => s.id}
        loading={isLoading}
        empty={<EmptyState title="No services" description="Create the first service offering." />}
      />
    </>
  );
}
