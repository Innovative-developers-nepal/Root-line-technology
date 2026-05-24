"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@rootline/ui/components";
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
import { useUpsertTeam, type TeamMember } from "@rootline/api-client";
import { teamFormSchema, type TeamFormValues } from "@/schemas/team";

export function TeamForm({ initial }: { initial?: TeamMember }) {
  const router = useRouter();
  const upsert = useUpsertTeam();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          role: initial.role,
          bio: initial.bio ?? "",
          avatar: initial.avatar ?? "",
          socialLinks: {
            linkedin: initial.socialLinks?.linkedin ?? "",
            twitter: initial.socialLinks?.twitter ?? "",
            github: initial.socialLinks?.github ?? "",
            website: initial.socialLinks?.website ?? "",
          },
          order: initial.order,
          published: initial.published,
        }
      : {
          name: "",
          role: "",
          bio: "",
          avatar: "",
          socialLinks: { linkedin: "", twitter: "", github: "", website: "" },
          order: 0,
          published: true,
        },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const stripped = {
      ...data,
      socialLinks: Object.fromEntries(
        Object.entries(data.socialLinks ?? {}).filter(([, v]) => v),
      ),
    };
    await upsert.mutateAsync({ id: initial?.id, ...stripped });
    router.push("/team");
    router.refresh();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <FormSection title="Profile">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Role</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar filename</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="upload-2025-xxxx.png" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Social">
          {(["linkedin", "twitter", "github", "website"] as const).map((k) => (
            <FormField
              key={k}
              control={form.control}
              name={`socialLinks.${k}` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{k}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </FormSection>

        <FormSection title="Publishing">
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
