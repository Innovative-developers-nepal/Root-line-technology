"use client";
import { useUpdateApplicationStatus, type JobApplication } from "@rootline/api-client";

const STATUSES: JobApplication["status"][] = ["NEW", "REVIEW", "INTERVIEW", "HIRED", "REJECTED"];

export function ApplicantStatusSelect({ row }: { row: JobApplication }) {
  const mut = useUpdateApplicationStatus();
  return (
    <select
      value={row.status}
      disabled={mut.isPending}
      onChange={(e) =>
        mut.mutate({ id: row.id, status: e.target.value as JobApplication["status"] })
      }
      className="h-8 rounded-md border border-border bg-background px-2 text-xs"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
