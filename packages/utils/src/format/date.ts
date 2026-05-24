import { format, formatDistanceToNow, parseISO } from "date-fns";

export type DateFormat = "short" | "long" | "relative" | "iso";

export function formatDate(input: Date | string, mode: DateFormat = "short"): string {
  const d = typeof input === "string" ? parseISO(input) : input;
  switch (mode) {
    case "short":
      return format(d, "MMM d, yyyy");
    case "long":
      return format(d, "MMMM d, yyyy");
    case "relative":
      return formatDistanceToNow(d, { addSuffix: true });
    case "iso":
      return d.toISOString();
  }
}

export function formatDateRange(from: Date | string, to: Date | string): string {
  return `${formatDate(from)} – ${formatDate(to)}`;
}

export function toISODate(input: Date | string): string {
  const d = typeof input === "string" ? parseISO(input) : input;
  return d.toISOString().slice(0, 10);
}
