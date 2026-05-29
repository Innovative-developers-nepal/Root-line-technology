"use client";

import { useState } from "react";
import { useUser } from "@rootline/auth-client";

interface CommentFormProps {
  onSubmit: (data: { authorName: string; authorEmail: string; content: string }) => Promise<void>;
  placeholder?: string;
  buttonLabel?: string;
  onCancel?: () => void;
}

export function CommentForm({ onSubmit, placeholder = "Write a comment...", buttonLabel = "Post Comment", onCancel }: CommentFormProps) {
  const user = useUser();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        authorName: user?.name ?? name,
        authorEmail: user?.email ?? email,
        content: content.trim(),
      });
      setContent("");
      if (!user) {
        setEmail("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!user && (
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {user && (
        <p className="text-sm text-muted-foreground">
          Commenting as <span className="font-medium text-foreground">{user.name}</span>
        </p>
      )}

      <textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
      />

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "Posting..." : buttonLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
