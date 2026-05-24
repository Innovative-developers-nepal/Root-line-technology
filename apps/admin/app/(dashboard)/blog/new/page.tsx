import { ResourceFormShell } from "@/components/resource-form-shell";
import { BlogForm } from "@/components/forms/blog-form";

export default function NewBlogPage() {
  return (
    <ResourceFormShell title="New post" backHref="/blog">
      <BlogForm />
    </ResourceFormShell>
  );
}
