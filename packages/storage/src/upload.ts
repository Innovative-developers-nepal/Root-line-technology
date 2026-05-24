import { api } from "@rootline/api-client";

export type UploadResult = { filename: string; url: string };

export async function upload(file: File): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  return api.request<UploadResult>("/api/v1/upload", { method: "POST", body: fd });
}
