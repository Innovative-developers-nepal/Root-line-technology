import * as React from "react";
import { cn } from "../lib/cn";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function FilterBar({
  search,
  filters,
  actions,
  className,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {search}
        {filters}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
