"use client";
import { useCallback, useState } from "react";

export function useCopyToClipboard(timeoutMs = 1500): [boolean, (text: string) => Promise<boolean>] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeoutMs);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [timeoutMs],
  );

  return [copied, copy];
}
