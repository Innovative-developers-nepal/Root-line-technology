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
import { useUpsertService, type Service } from "@rootline/api-client";
import { serviceFormSchema, type ServiceFormValues } from "@/schemas/service";

export function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const upsert = useUpsertService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initial
      ? {
          slug: initial.slug,
          title: initial.title,
          summary: initial.summary,
          body: (initial.body as Record<string, unknown>) ?? {},
          iconKey: initial.iconKey ?? "",
          order: initial.order,
          published: initial.published,
          seoTitle: initial.seoTitle ?? "",
          seoDescription: initial.seoDescription ?? "",
          ogImage: initial.ogImage ?? "",
        }
      : {
          slug: "",
          title: "",
          summary: "",
          body: { type: "doc", content: [{ type: "paragraph" }] },
          iconKey: "",
          order: 0,
          published: true,
          seoTitle: "",
          seoDescription: "",
          ogImage: "",
        },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await upsert.mutateAsync({ id: initial?.id, ...data, ogImage: data.ogImage || undefined });
    router.push("/services");
    router.refresh();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <FormSection title="Basics" description="Slug, title, summary.">
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
                  <Input {...field} placeholder="vapt" />
                </FormControl>
                <FormDescription>URL-safe identifier.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Summary</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="iconKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon key</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="shield-check" />
                </FormControl>
                <FormDescription>lucide-react icon name (kebab-case).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Body" description="Long-form description.">
          <FormField
            control={form.control}
            name="body"
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

        <FormSection title="Publishing" description="Display order + visibility.">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
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

        <FormSection title="SEO" description="Optional overrides.">
          <FormField
            control={form.control}
            name="seoTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seoDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO description</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ogImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OG image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {upsert.error && (
          <p role="alert" className="text-sm text-destructive">
            {upsert.error instanceof Error ? upsert.error.message : "Failed."}
          </p>
        )}

        <FormActions>
          <Button type="submit" disabled={form.formState.isSubmitting || upsert.isPending}>
            {upsert.isPending ? "Saving…" : initial ? "Save changes" : "Create"}
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
