"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye } from "lucide-react";
import { DataTable, EmptyState, type ColumnDef } from "@rootline/ui/data";
import { Badge, Button } from "@rootline/ui/components";
import {
  useContactList,
  useMarkContactRead,
  type ContactMessage,
} from "@rootline/api-client";
import { AdminPageHeader } from "@/components/page-header";
import { formatDate, truncate } from "@rootline/utils";

export default function ContactsAdminPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useContactList();
  const markRead = useMarkContactRead();
  const [active, setActive] = useState<ContactMessage | null>(null);
  const rows = data?.pages.flatMap((p) => p.items) ?? [];

  const open = (c: ContactMessage) => {
    setActive(c);
    if (!c.read) markRead.mutate(c.id);
  };

  const columns: ColumnDef<ContactMessage>[] = [
    {
      key: "name",
      header: "From",
      cell: (c) => (
        <span className={c.read ? "" : "font-semibold"}>{c.name}</span>
      ),
    },
    { key: "email", header: "Email", cell: (c) => c.email },
    { key: "subject", header: "Subject", cell: (c) => <Badge>{c.subject.replace("_", " ")}</Badge> },
    { key: "message", header: "Message", cell: (c) => truncate(c.message, 80) },
    { key: "createdAt", header: "Received", cell: (c) => formatDate(c.createdAt, "relative") },
    {
      key: "actions",
      header: "",
      align: "right",
      width: "80px",
      cell: (c) => (
        <Button variant="ghost" size="sm" onClick={() => open(c)}>
          <Eye className="mr-1 h-3.5 w-3.5" />
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader title="Contacts" description="Inbound messages from marketing site." />
      <DataTable
        columns={columns}
        data={rows}
        rowKey={(c) => c.id}
        loading={isLoading}
        empty={<EmptyState title="Inbox empty" />}
        cursorPagination={{
          hasNext: !!hasNextPage,
          isLoading: isFetchingNextPage,
          onNext: () => fetchNextPage(),
        }}
      />

      <Dialog.Root open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-md border border-border bg-card p-8 shadow-lg">
            {active && (
              <>
                <Dialog.Title className="font-display text-2xl">{active.name}</Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  <a className="hover:underline" href={`mailto:${active.email}`}>
                    {active.email}
                  </a>
                  {" · "}
                  <Badge>{active.subject.replace("_", " ")}</Badge>
                  {" · "}
                  {formatDate(active.createdAt, "long")}
                </Dialog.Description>
                <div className="mt-6 whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                  {active.message}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setActive(null)}>
                    Close
                  </Button>
                  <Button asChild>
                    <a href={`mailto:${active.email}?subject=Re: Rootline contact`}>Reply</a>
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
