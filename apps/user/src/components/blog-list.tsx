"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { Container } from "@rootline/ui/components";
import { cn } from "@rootline/ui/lib/cn";
import type { BlogPost } from "@rootline/api-client";
import { formatDate } from "@rootline/utils";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const filtered = term
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.excerpt.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term)),
      )
    : posts;

  return (
    <Container className="py-20 md:py-28">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Research
        </span>
        <h1 className="mt-6 font-display text-5xl leading-[1] tracking-[-0.03em] text-foreground md:text-7xl">
          Writing from <span className="text-foreground/40">Rootline</span>
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          Engineering notes, security write-ups, and product thinking.
        </p>
      </div>

      {/* Search */}
      <div className="mt-10 flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3.5 shadow-sm">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles..."
          aria-label="Search articles"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* List */}
      <div className="mt-12 flex flex-col gap-6">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-border/60 bg-muted/30 p-10 text-center text-muted-foreground">
            {posts.length === 0 ? "No posts yet." : "No articles match your search."}
          </p>
        ) : (
          filtered.map((post, i) => {
            const reversed = i % 2 === 1;
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="grid items-center gap-6 overflow-hidden rounded-2xl border border-border/60 bg-muted/30 p-6 transition-all duration-300 hover:border-primary/40 hover:bg-muted/50 md:grid-cols-2 md:gap-10 md:p-8">
                  <div className={cn(reversed && "md:order-2")}>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {post.category && (
                        <span className="inline-flex rounded-full border border-border/60 bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          {post.category}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                          {post.readTime}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 font-display text-2xl leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary md:text-3xl">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      {post.publishedAt && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt, "long")}
                        </span>
                      )}
                      <span className="inline-flex translate-x-0 items-center gap-1.5 text-xs font-medium text-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                        Read article
                        <ArrowUpRight className="h-3.5 w-3.5 text-primary" aria-hidden />
                      </span>
                    </div>
                  </div>

                  <div className={cn("relative aspect-[16/10] overflow-hidden rounded-xl bg-muted", reversed && "md:order-1")}>
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/10 to-accent/10">
                        <span className="font-display text-4xl text-primary/40">RL</span>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            );
          })
        )}
      </div>
    </Container>
  );
}
