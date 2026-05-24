"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { CardListSkeleton, type CardListSkeletonProps } from "./card-list-skeleton";
import { EmptyState } from "./empty-state";

export interface CursorListProps<T> {
  items: T[];
  rowKey: (item: T) => string;
  render: (item: T) => React.ReactNode;
  isLoading?: boolean;
  isFetchingNext?: boolean;
  hasNext?: boolean;
  onNext?: () => void;
  empty?: { title: string; description?: string; action?: React.ReactNode };
  skeleton?: Pick<CardListSkeletonProps, "count" | "cols" | "itemClassName">;
  className?: string;
  gridClassName?: string;
}

export function CursorList<T>({
  items,
  rowKey,
  render,
  isLoading,
  isFetchingNext,
  hasNext,
  onNext,
  empty,
  skeleton,
  className,
  gridClassName,
}: CursorListProps<T>) {
  if (isLoading) {
    return <CardListSkeleton className={cn(className, gridClassName)} {...skeleton} />;
  }

  if (items.length === 0 && empty) {
    return (
      <div className={cn(className)}>
        <EmptyState title={empty.title} description={empty.description} action={empty.action} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className={cn("grid gap-6 md:grid-cols-2", gridClassName)}>
        {items.map((item) => (
          <React.Fragment key={rowKey(item)}>{render(item)}</React.Fragment>
        ))}
      </div>
      {hasNext && (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={isFetchingNext}
            onClick={onNext}
            className="rounded-md border border-border px-5 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {isFetchingNext ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
