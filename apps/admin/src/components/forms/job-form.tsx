"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@rootline/ui/components";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSection,
  FormActions,
} from "@rootline/ui/forms";
import { RichTextEditor } from "@rootline/ui/editor";
import { useUpsertJob, type Job } from "@rootline/api-client";
import { jobFormSchema, JOB_TYPES, type JobFormValues } from "@/schemas/job";

export function JobForm({ initial }: { initial?: Job }) {
  const router = useRouter();
  const upsert = useUpsertJob();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initial
      ? {
          slug: initial.slug,
          title: initial.title,
          department: initial.department ?? "",
          location: initial.location,
          type: initial.type,
          body: (initial.body as Record<string, unknown>) ?? {},
          salaryRange: initial.salaryRange ?? "",
          isOpen: initial.isOpen,
        }
      : {
          slug: "",
          title: "",
          department: "",
          location: "Remote",
          type: "FULL_TIME",
          body: { type: "doc", content: [{ type: "paragraph" }] },
          salaryRange: "",
          isOpen: true,
        },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await upsert.mutateAsync({ id: initial?.id, ...data });
    router.push("/jobs");
    router.refresh();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <FormSection title="Role">
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Engineering" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Remote / Kathmandu" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salaryRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary range</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="$80k – $120k" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Description">
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

        <FormSection title="Status">
          <FormField
            control={form.control}
            name="isOpen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open for applications</FormLabel>
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
