"use client";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useMemo } from "react";
import { cn } from "../lib/cn";
import type { TiptapJson } from "./rich-text-editor";

export function RichTextRenderer({
  content,
  className,
}: {
  content: TiptapJson | null | undefined;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!content) return "";
    try {
      return generateHTML(content as never, [StarterKit, Link, Image]);
    } catch {
      return "";
    }
  }, [content]);

  if (!html) return null;
  return (
    <div
      className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
