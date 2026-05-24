const API_BASE =
  (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined) ??
  "http://localhost:5000";

export function getUrl(filename: string): string {
  if (filename.startsWith("http://") || filename.startsWith("https://")) return filename;
  return `${API_BASE}/uploads/${filename.replace(/^\/+/, "")}`;
}
