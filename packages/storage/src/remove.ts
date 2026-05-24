import { api } from "@rootline/api-client";

export async function remove(filename: string): Promise<void> {
  await api.request<void>(`/api/v1/upload/${encodeURIComponent(filename)}`, { method: "DELETE" });
}
