"use client";

import { useState } from "react";
import { formatDate } from "@rootline/utils";
import { CommentForm } from "./comment-form";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  replies?: Comment[];
}

interface CommentCardProps {
  comment: Comment;
  onReply: (parentId: string, data: { authorName: string; authorEmail: string; content: string }) => Promise<void>;
  isReply?: boolean;
}

export function CommentCard({ comment, onReply, isReply }: CommentCardProps) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className={isReply ? "ml-8 border-l-2 border-border pl-4" : ""}>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{comment.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt, "long")}
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed">{comment.content}</p>
        {!isReply && (
          <button
            onClick={() => setShowReply(!showReply)}
            className="mt-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {showReply ? "Cancel reply" : "Reply"}
          </button>
        )}
      </div>

      {showReply && (
        <div className="mt-3">
          <CommentForm
            onSubmit={(data) => onReply(comment.id, data)}
            placeholder="Write a reply..."
            buttonLabel="Post Reply"
            onCancel={() => setShowReply(false)}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} onReply={onReply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}
