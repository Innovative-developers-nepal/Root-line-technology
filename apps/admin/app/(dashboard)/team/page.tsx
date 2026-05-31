"use client";
import Link from "next/link";
import { Button } from "@rootline/ui/components";
import { DataTable, EmptyState, type ColumnDef } from "@rootline/ui/data";
import { useTeamList, useDeleteTeam, type TeamMember } from "@rootline/api-client";
import { AdminPageHeader } from "@/components/page-header";
import { RowActions } from "@/components/row-actions";

export default function TeamAdminPage() {
  const { data, isLoading } = useTeamList();
  const del = useDeleteTeam();

  const columns: ColumnDef<TeamMember>[] = [
    { key: "name", header: "Name", cell: (m) => m.name },
    { key: "role", header: "Role", cell: (m) => m.role },
    { key: "order", header: "Order", cell: (m) => m.order, align: "right" },
    { key: "published", header: "Status", cell: (m) => (m.published ? "Published" : "Draft") },
    {
      key: "actions",
      header: "",
      width: "56px",
      align: "right",
      cell: (m) => (
        <RowActions
          editHref={`/team/${m.id}/edit`}
          onDelete={() => del.mutateAsync(m.id)}
          deletePending={del.isPending}
        />
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Team"
        description="People rendered on /about."
        actions={
          <Button asChild className="p-2 px-4">
            <Link href="/team/new">New member</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        rowKey={(m) => m.id}
        loading={isLoading}
        empty={<EmptyState title="No team members" description="Add the first profile." />}
      />
    </>
  );
}
