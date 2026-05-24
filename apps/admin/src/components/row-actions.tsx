"use client";
import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@rootline/ui/lib/cn";
import { ConfirmDelete } from "./confirm-delete";

export function RowActions({
  editHref,
  onDelete,
  deletePending,
}: {
  editHref?: string;
  onDelete?: () => void | Promise<void>;
  deletePending?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Row actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className={cn(
              "z-50 min-w-[140px] rounded-md border border-border bg-popover p-1 text-sm shadow-md",
              "data-[state=open]:animate-in data-[state=open]:fade-in",
            )}
          >
            {editHref && (
              <DropdownMenu.Item asChild>
                <Link
                  href={editHref as never}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1.5 outline-none hover:bg-muted focus:bg-muted"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </DropdownMenu.Item>
            )}
            {onDelete && (
              <DropdownMenu.Item
                onSelect={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1.5 text-destructive outline-none hover:bg-destructive/10 focus:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {onDelete && (
        <ConfirmDelete
          open={open}
          onOpenChange={setOpen}
          onConfirm={async () => {
            await onDelete();
            setOpen(false);
          }}
          pending={deletePending}
        />
      )}
    </>
  );
}
