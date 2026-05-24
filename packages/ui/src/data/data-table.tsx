"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Skeleton } from "../components/skeleton";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
}

const tableStyles = cva("w-full", {
  variants: {
    variant: {
      dense:       "text-sm [&_th]:py-2 [&_td]:py-2",
      comfortable: "text-sm [&_th]:py-3.5 [&_td]:py-3.5",
      bordered:    "text-sm [&_th]:py-3 [&_td]:py-3 border border-border rounded-md",
      cards:       "block",
    },
  },
  defaultVariants: { variant: "comfortable" },
});

const rowStyles = cva("border-b border-border transition-colors", {
  variants: {
    interactive: {
      true:  "hover:bg-muted/50 cursor-pointer",
      false: "",
    },
  },
  defaultVariants: { interactive: false },
});

export interface DataTableProps<T>
  extends VariantProps<typeof tableStyles> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: (row: T) => string;
  empty?: React.ReactNode;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  className?: string;
  cursorPagination?: {
    hasNext: boolean;
    isLoading?: boolean;
    onNext: () => void;
  };
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  empty,
  loading,
  onRowClick,
  variant,
  className,
  cursorPagination,
}: DataTableProps<T>) {
  if (variant === "cards") {
    return (
      <div className={cn("grid gap-3", className)}>
        {loading && (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        )}
        {!loading && data.length === 0 && empty}
        {!loading && data.map((row) => (
          <div
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn(
              "rounded-md border border-border bg-card p-4",
              onRowClick && "cursor-pointer transition-colors hover:bg-muted/40",
            )}
          >
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
              {columns.map((col) => (
                <React.Fragment key={col.key}>
                  <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {col.header}
                  </dt>
                  <dd className="text-sm text-foreground">{col.cell(row)}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        ))}
        {cursorPagination?.hasNext && (
          <button
            type="button"
            disabled={cursorPagination.isLoading}
            onClick={cursorPagination.onNext}
            className="mt-2 rounded-md border border-border py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {cursorPagination.isLoading ? "Loading..." : "Load more"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className={tableStyles({ variant })}>
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "px-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <>
              {[0, 1, 2].map((i) => (
                <tr key={i} className="border-b border-border">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4">
                      <Skeleton className="h-4 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                {empty ?? <span className="text-sm text-muted-foreground">No results</span>}
              </td>
            </tr>
          )}
          {!loading && data.map((row) => (
            <tr
              key={rowKey(row)}
              className={rowStyles({ interactive: !!onRowClick })}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 text-foreground",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                  )}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {cursorPagination?.hasNext && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            disabled={cursorPagination.isLoading}
            onClick={cursorPagination.onNext}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {cursorPagination.isLoading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
