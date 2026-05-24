"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@rootline/ui/components";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
  FormActions,
} from "@rootline/ui/forms";
import { RichTextEditor } from "@rootline/ui/editor";
import { useCreateBlog, useUpdateBlog, type BlogPost } from "@rootline/api-client";
import { blogFormSchema, type BlogFormValues } from "@/schemas/blog";

export function BlogForm({ initial }: { initial?: BlogPost }) {
  const router = useRouter();
  const create = useCreateBlog();
  const update = useUpdateBlog();
  const pending = create.isPending || update.isPending;
  const error = create.error ?? update.error;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: initial
      ? {
          slug: initial.slug,
          title: initial.title,
          excerpt: initial.excerpt,
          content: (initial.content as Record<string, unknown>) ?? {},
          coverImage: initial.coverImage ?? "",
          category: initial.category,
          tags: initial.tags,
          author: initial.author,
          readTime: initial.readTime ?? "5 min",
          published: initial.published,
        }
      : {
          slug: "",
          title: "",
          excerpt: "",
          content: { type: "doc", content: [{ type: "paragraph" }] },
          coverImage: "",
          category: "general",
          tags: [],
          author: "",
          readTime: "5 min",
          published: false,
        },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const payload = { ...data, coverImage: data.coverImage || undefined };
    if (initial) await update.mutateAsync({ id: initial.id, ...payload } as never);
    else await create.mutateAsync(payload as never);
    router.push("/blog");
    router.refresh();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <FormSection title="Basics">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Excerpt</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Content">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RichTextEditor
                    value={field.value as Record<string, unknown>}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Meta">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Author</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="readTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Read time</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="5 min" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    value={field.value.join(", ")}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder="security, vapt"
                  />
                </FormControl>
                <FormDescription>Comma-separated.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Published</FormLabel>
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed."}
          </p>
        )}

        <FormActions>
          <Button type="submit" disabled={form.formState.isSubmitting || pending}>
            {pending ? "Saving…" : initial ? "Save changes" : "Create"}
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
