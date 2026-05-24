import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { qk } from "../query-keys";
import type { CursorPage, ListFilters } from "../types";

export type Job = {
  id: string;
  slug: string;
  title: string;
  department?: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  body: unknown;
  salaryRange?: string;
  isOpen: boolean;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchJobList(filters: ListFilters = {}): Promise<CursorPage<Job>> {
  const { data, meta } = await api.requestWithMeta<Job[]>("/api/v1/jobs", { query: { ...filters } });
  return { items: data ?? [], nextCursor: meta?.pagination?.nextCursor ?? null };
}

export async function fetchJob(slug: string): Promise<Job> {
  return api.request<Job>(`/api/v1/jobs/${slug}`);
}

export async function listAllJobSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const out: { slug: string; updatedAt: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await fetchJobList({ cursor, take: 100 });
    out.push(...page.items.map((j) => ({ slug: j.slug, updatedAt: j.updatedAt })));
    cursor = page.nextCursor ?? undefined;
  } while (cursor);
  return out;
}

export function useJobList(filters: ListFilters = {}) {
  return useInfiniteQuery({
    queryKey: qk.job.list(filters),
    queryFn: ({ pageParam }) => fetchJobList({ ...filters, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}

export function useJob(slug: string) {
  return useQuery({ queryKey: qk.job.detail(slug), queryFn: () => fetchJob(slug), enabled: !!slug });
}

export function useUpsertJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Job> & { id?: string }) =>
      input.id
        ? api.request<Job>(`/api/v1/jobs/${input.id}`, { method: "PATCH", body: input })
        : api.request<Job>("/api/v1/jobs", { method: "POST", body: input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.job.all }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.request<void>(`/api/v1/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.job.all }),
  });
}
