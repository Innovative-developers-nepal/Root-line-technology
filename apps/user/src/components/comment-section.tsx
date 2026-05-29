"use client";

import { useEffect, useState } from "react";
import { api } from "@rootline/api-client";
import { Separator } from "@rootline/ui/components";
import { CommentCard } from "./comment-card";
import { CommentForm } from "./comment-form";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  postSlug: string;
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchComments() {
    try {
      const data = await api.request<Comment[]>(`/api/v1/blog/${postSlug}/comments`);
      setComments(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  async function handleNewComment(data: { authorName: string; authorEmail: string; content: string }) {
    const comment = await api.request<Comment>(`/api/v1/blog/${postSlug}/comments`, {
      method: "POST",
      body: data,
    });
    setComments((prev) => [comment, ...prev]);
  }

  async function handleReply(parentId: string, data: { authorName: string; authorEmail: string; content: string }) {
    const reply = await api.request<Comment>(`/api/v1/blog/comments/${parentId}/replies`, {
      method: "POST",
      body: data,
    });
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies ?? []), reply] }
          : c,
      ),
    );
  }

  return (
    <section className="py-12">
      <Separator className="mb-8" />
      <h2 className="font-display text-2xl">
        Comments {!loading && <span className="text-muted-foreground">({comments.length})</span>}
      </h2>

      <div className="mt-6">
        <CommentForm onSubmit={handleNewComment} />
      </div>

      <div className="mt-8 space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground">Loading comments...</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        )}
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onReply={handleReply}
          />
        ))}
      </div>
    </section>
  );
}
