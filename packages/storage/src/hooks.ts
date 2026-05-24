"use client";
import { useMutation } from "@tanstack/react-query";
import { upload } from "./upload";

export function useUpload() {
  return useMutation({ mutationFn: (file: File) => upload(file) });
}
