import { useMutation } from "@tanstack/react-query";
import { api } from "../client";

export type UploadResult = { filename: string; url: string };

export async function uploadFile(file: File): Promise<UploadResult> {
  const fd = new FormData();
  fd.append("file", file);
  return api.request<UploadResult>("/api/v1/upload", { method: "POST", body: fd });
}

export function useUploadFile() {
  return useMutation({ mutationFn: uploadFile });
}
