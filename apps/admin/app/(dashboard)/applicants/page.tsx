"use client";
import { Download } from "lucide-react";
import { DataTable, EmptyState, type ColumnDef } from "@rootline/ui/data";
import { useApplicationList, type JobApplication } from "@rootline/api-client";
import { getUrl } from "@rootline/storage";
import { AdminPageHeader } from "@/components/page-header";
import { ApplicantStatusSelect } from "@/components/applicant-status-select";
import { formatDate } from "@rootline/utils";

export default function ApplicantsAdminPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useApplicationList();
  const rows = data?.pages.flatMap((p) => p.items) ?? [];

  const columns: ColumnDef<JobApplication>[] = [
    { key: "name", header: "Name", cell: (a) => `${a.firstName} ${a.lastName}` },
    { key: "email", header: "Email", cell: (a) => a.email },
    { key: "status", header: "Status", cell: (a) => <ApplicantStatusSelect row={a} /> },
    {
      key: "resume",
      header: "Resume",
      cell: (a) => (
        <a
          href={getUrl(a.resumeFile)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Download className="h-3.5 w-3.5" />
          PDF
        </a>
      ),
    },
    { key: "createdAt", header: "Received", cell: (a) => formatDate(a.createdAt, "relative") },
  ];

  return (
    <>
      <AdminPageHeader title="Applicants" description="Job applications inbox." />
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(a) => a.id}
        loading={isLoading}
        empty={<EmptyState title="No applications yet" />}
        cursorPagination={{
          hasNext: !!hasNextPage,
          isLoading: isFetchingNextPage,
          onNext: () => fetchNextPage(),
        }}
      />
    </>
  );
}
