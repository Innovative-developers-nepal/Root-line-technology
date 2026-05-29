import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { qk } from "../query-keys";
import type { CursorPage, ListFilters } from "../types";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  content: Record<string, unknown>;
  tags: string[];
  author: string;
  category: string;
  readTime: string;
  published: boolean;
  publishedAt: string | null;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
};

export async function fetchBlogList(filters: ListFilters = {}): Promise<CursorPage<BlogPost>> {
  const { data, meta } = await api.requestWithMeta<BlogPost[]>("/api/v1/blog", { query: { ...filters } });
  return { items: data ?? [], nextCursor: meta?.pagination?.nextCursor ?? null };
}

export async function fetchBlog(slug: string): Promise<BlogPost> {
  return api.request<BlogPost>(`/api/v1/blog/${slug}`);
}

export async function listAllBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const out: { slug: string; updatedAt: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await fetchBlogList({ cursor, take: 100, published: true });
    out.push(...page.items.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt })));
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return out;
}

export function useBlogList(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.blog.list(filters),
    queryFn: ({ pageParam }) => fetchBlogList({ ...filters, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useBlog(slug: string, opts: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: qk.blog.detail(slug),
    queryFn: () => fetchBlog(slug),
    enabled: opts.enabled ?? !!slug,
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<BlogPost>) => api.request<BlogPost>("/api/v1/blog", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.blog.all }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string } & Partial<BlogPost>) =>
      api.request<BlogPost>(`/api/v1/blog/${id}`, { method: "PATCH", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.blog.all }),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.request<void>(`/api/v1/blog/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.blog.all }),
  });
}
