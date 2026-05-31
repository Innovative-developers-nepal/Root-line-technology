"use client";
import Link from "next/link";
import { Button, Badge } from "@rootline/ui/components";
import { DataTable, EmptyState, type ColumnDef } from "@rootline/ui/data";
import { useJobList, useDeleteJob, type Job } from "@rootline/api-client";
import { AdminPageHeader } from "@/components/page-header";
import { RowActions } from "@/components/row-actions";
import { formatDate } from "@rootline/utils";

export default function JobsAdminPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useJobList();
  const del = useDeleteJob();
  const rows = data?.pages.flatMap((p) => p.items) ?? [];

  const columns: ColumnDef<Job>[] = [
    { key: "title", header: "Title", cell: (j) => j.title },
    { key: "location", header: "Location", cell: (j) => j.location },
    { key: "type", header: "Type", cell: (j) => <Badge>{j.type.replace("_", " ")}</Badge> },
    { key: "isOpen", header: "Status", cell: (j) => (j.isOpen ? "Open" : "Closed") },
    { key: "postedAt", header: "Posted", cell: (j) => formatDate(j.postedAt) },
    {
      key: "actions",
      header: "",
      width: "56px",
      align: "right",
      cell: (j) => (
        <RowActions
          editHref={`/jobs/${j.id}/edit`}
          onDelete={() => del.mutateAsync(j.id)}
          deletePending={del.isPending}
        />
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Jobs"
        description="Career postings."
        actions={
          <Button asChild className="p-2 px-4">
            <Link href="/jobs/new">New job</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(j) => j.id}
        loading={isLoading}
        empty={<EmptyState title="No jobs" description="Post the first role." />}
        cursorPagination={{
          hasNext: !!hasNextPage,
          isLoading: isFetchingNextPage,
          onNext: () => fetchNextPage(),
        }}
      />
    </>
  );
}
