"use client";
import Link from "next/link";
import { Button } from "@rootline/ui/components";
import { DataTable, EmptyState, type ColumnDef } from "@rootline/ui/data";
import { useAdminBlogList, useDeleteBlog, type BlogPost } from "@rootline/api-client";
import { AdminPageHeader } from "@/components/page-header";
import { RowActions } from "@/components/row-actions";
import { formatDate } from "@rootline/utils";

export default function BlogAdminPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAdminBlogList();
  const del = useDeleteBlog();
  const rows = data?.pages.flatMap((p) => p.items) ?? [];

  const columns: ColumnDef<BlogPost>[] = [
    { key: "title", header: "Title", cell: (p) => p.title },
    { key: "slug", header: "Slug", cell: (p) => <code className="text-xs">{p.slug}</code> },
    { key: "status", header: "Status", cell: (p) => (p.publishedAt ? "Published" : "Draft") },
    { key: "updatedAt", header: "Updated", cell: (p) => formatDate(p.updatedAt, "relative") },
    {
      key: "actions",
      header: "",
      width: "56px",
      align: "right",
      cell: (p) => (
        <RowActions
          editHref={`/blog/${p.id}/edit`}
          onDelete={() => del.mutateAsync(p.id)}
          deletePending={del.isPending}
        />
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description="Articles + tutorials. Tiptap editor."
        actions={
          <Button asChild>
            <Link href="/blog/new">New post</Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(p) => p.id}
        loading={isLoading}
        empty={<EmptyState title="No posts" />}
        cursorPagination={{
          hasNext: !!hasNextPage,
          isLoading: isFetchingNextPage,
          onNext: () => fetchNextPage(),
        }}
      />
    </>
  );
}
