"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { fetchBlogPostById } from "@rootline/api-client";
import { Skeleton } from "@rootline/ui/components";
import { ResourceFormShell } from "@/components/resource-form-shell";
import { BlogForm } from "@/components/forms/blog-form";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog", "admin", "detail", id],
    queryFn: () => fetchBlogPostById(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!post) notFound();

  return (
    <ResourceFormShell title="Edit post" description={post.title} backHref="/blog">
      <BlogForm initial={post} />
    </ResourceFormShell>
  );
}
