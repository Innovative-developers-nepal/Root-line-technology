"use client";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, X, Trash2, MessageSquare } from "lucide-react";
import { DataTable, EmptyState, type ColumnDef } from "@rootline/ui/data";
import { Badge, Button } from "@rootline/ui/components";
import { api } from "@rootline/api-client";
import { AdminPageHeader } from "@/components/page-header";
import { formatDate, truncate } from "@rootline/utils";

interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
  blogPost: { title: string; slug: string };
}

export default function CommentsAdminPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Comment | null>(null);

  async function fetchComments() {
    try {
      const data = await api.request<Comment[]>("/api/v1/blog/admin/comments");
      setComments(data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => {
    fetchComments();
  }, []);

  async function toggleApproval(id: string) {
    await api.request(`/api/v1/blog/admin/comments/${id}/approve`, { method: "PUT" });
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isApproved: !c.isApproved } : c)),
    );
    if (active?.id === id) setActive(null);
  }

  async function deleteComment(id: string) {
    await api.request(`/api/v1/blog/admin/comments/${id}`, { method: "DELETE" });
    setComments((prev) => prev.filter((c) => c.id !== id));
    if (active?.id === id) setActive(null);
  }

  const columns: ColumnDef<Comment>[] = [
    {
      key: "authorName",
      header: "Author",
      cell: (c) => (
        <span className={c.isApproved ? "" : "font-semibold"}>{c.authorName}</span>
      ),
    },
    {
      key: "blogPost",
      header: "Post",
      cell: (c) => (
        <span className="text-muted-foreground">{truncate(c.blogPost.title, 40)}</span>
      ),
    },
    {
      key: "content",
      header: "Comment",
      cell: (c) => truncate(c.content, 80),
    },
    {
      key: "isApproved",
      header: "Status",
      cell: (c) =>
        c.isApproved ? (
          <Badge variant="secondary">Approved</Badge>
        ) : (
          <Badge variant="outline">Pending</Badge>
        ),
    },
    {
      key: "createdAt",
      header: "Date",
      cell: (c) => formatDate(c.createdAt, "relative"),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "120px",
      cell: (c) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setActive(c)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Comments" description="Moderate blog comments." />
      <DataTable
        columns={columns}
        data={comments}
        rowKey={(c) => c.id}
        loading={loading}
        empty={<EmptyState title="No comments yet" icon={<MessageSquare className="h-8 w-8" />} />}
      />

      <Dialog.Root open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-card p-8 shadow-lg">
            {active && (
              <>
                <Dialog.Title className="font-display text-2xl">{active.authorName}</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  <a className="hover:underline" href={`mailto:${active.authorEmail}`}>
                    {active.authorEmail}
                  </a>
                  {" · "}
                  {active.isApproved ? (
                    <Badge variant="secondary">Approved</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                  {" · "}
                  {formatDate(active.createdAt, "long")}
                  {" · "}
                  on <span className="text-foreground">{active.blogPost.title}</span>
                </Dialog.Description>
                <div className="mt-6 whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                  {active.content}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActive(null)}>
                    Close
                  </Button>
                  <Button
                    variant={active.isApproved ? "outline" : "default"}
                    onClick={() => toggleApproval(active.id)}
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    {active.isApproved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteComment(active.id)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
