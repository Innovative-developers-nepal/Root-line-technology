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
import { useSubmitContact } from "@rootline/api-client";
import { track } from "@rootline/analytics";
import { contactFormSchema, CONTACT_SUBJECTS, type ContactFormValues } from "@/schemas/contact";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const submit = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "SERVICES_INQUIRY", message: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await submit.mutateAsync(data);
      track("contact_submitted", { subject: data.subject });
      setSubmitted(true);
    } catch {
      /* surfaced below */
    }
  });

  if (submitted) {
    return <p className="text-sm text-primary">Thanks. We will reply within one business day.</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
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
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                >
                  {CONTACT_SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ").toLowerCase()}
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
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Message</FormLabel>
              <FormControl>
                <Textarea rows={6} {...field} />
              </FormControl>
              <FormDescription>Minimum 10 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {submit.error && (
          <p role="alert" className="text-sm text-destructive">
            {submit.error instanceof Error ? submit.error.message : "Submission failed."}
          </p>
        )}

        <FormActions>
          <Button type="submit" disabled={form.formState.isSubmitting || submit.isPending}>
            {submit.isPending ? "Sending…" : "Send message"}
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}
