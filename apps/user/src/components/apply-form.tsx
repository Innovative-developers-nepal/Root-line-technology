"use client";
import { useState } from "react";
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
  FormActions,
} from "@rootline/ui/forms";
import { useSubmitApplication, useUploadFile } from "@rootline/api-client";
import { track } from "@rootline/analytics";
import { applicationFormSchema, type ApplicationFormValues } from "@/schemas/application";

export function ApplyForm({ jobId, jobSlug }: { jobId: string; jobSlug: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | undefined>();
  const uploadMut = useUploadFile();
  const submitMut = useSubmitApplication();

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", coverNote: "" },
  });

  const submitting =
    form.formState.isSubmitting || uploadMut.isPending || submitMut.isPending;

  const onSubmit = form.handleSubmit(async (data) => {
    setResumeError(undefined);
    if (!resume) {
      setResumeError("Resume PDF required.");
      return;
    }
    try {
      const { filename } = await uploadMut.mutateAsync(resume);
      await submitMut.mutateAsync({
        jobId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        coverNote: data.coverNote,
        resumeFile: filename,
      });
      track("application_submitted", { jobSlug });
      setSubmitted(true);
    } catch {
      /* surfaced below */
    }
  });

  if (submitted) {
    return <p className="text-sm text-primary">Application received. We will be in touch.</p>;
  }

  const mutationError = uploadMut.error ?? submitMut.error;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverNote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why us?</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="resume" className="text-sm font-medium">
            Resume (PDF) <span className="text-destructive">*</span>
          </label>
          <input
            id="resume"
            type="file"
            accept="application/pdf"
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-border file:bg-background file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-muted"
            onChange={(e) => setResume(e.target.files?.[0] ?? null)}
          />
          {resumeError && (
            <p role="alert" className="text-xs font-medium text-destructive">
              {resumeError}
            </p>
          )}
        </div>

        {mutationError && (
          <p role="alert" className="text-sm text-destructive">
            {mutationError instanceof Error ? mutationError.message : "Submission failed."}
          </p>
        )}

        <FormActions>
          <Button type="submit" disabled={submitting}>
            {uploadMut.isPending
              ? "Uploading resume…"
              : submitMut.isPending
                ? "Submitting…"
                : "Submit application"}
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
